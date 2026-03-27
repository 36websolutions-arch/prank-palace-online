import type { VercelRequest, VercelResponse } from "@vercel/node";

const XFORGE_URL = process.env.XFORGE_URL || "http://5.161.106.11:3900";
const XFORGE_USERNAME = process.env.XFORGE_USERNAME || "admin";
const XFORGE_PASSWORD = process.env.XFORGE_PASSWORD || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

// Cached xforge JWT (serverless functions may reuse across invocations)
let cachedToken: { accessToken: string; refreshToken: string; expiresAt: number } | null = null;

async function getXforgeToken(): Promise<string> {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.accessToken;
  }

  // Try refresh first if we have a refresh token
  if (cachedToken?.refreshToken) {
    try {
      const res = await fetch(`${XFORGE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: cachedToken.refreshToken }),
      });
      if (res.ok) {
        const data = await res.json();
        cachedToken = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresAt: Date.now() + 14 * 60 * 1000, // assume ~15min expiry
        };
        return cachedToken.accessToken;
      }
    } catch {
      // Fall through to full login
    }
  }

  // Full login
  const res = await fetch(`${XFORGE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: XFORGE_USERNAME, password: XFORGE_PASSWORD }),
  });

  if (!res.ok) {
    throw new Error(`xforge login failed: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + 14 * 60 * 1000,
  };
  return cachedToken.accessToken;
}

async function validateAdmin(authHeader: string | undefined): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const jwt = authHeader.slice(7);

  try {
    // First get the user ID from the JWT
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${jwt}`, apikey: SUPABASE_ANON_KEY },
    });
    if (!userRes.ok) return false;
    const user = await userRes.json();
    const userId = user?.id;
    if (!userId) return false;

    // Check the profiles table for admin role (using user's own JWT — RLS allows self-read)
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}&select=role`,
      { headers: { Authorization: `Bearer ${jwt}`, apikey: SUPABASE_ANON_KEY } },
    );
    if (!profileRes.ok) return false;
    const profiles = await profileRes.json();
    if (Array.isArray(profiles) && profiles.some((p: { role: string }) => p.role === "admin")) {
      return true;
    }

    // Fallback: check user_roles table
    const rolesRes = await fetch(
      `${SUPABASE_URL}/rest/v1/user_roles?user_id=eq.${userId}&select=role`,
      { headers: { Authorization: `Bearer ${jwt}`, apikey: SUPABASE_ANON_KEY } },
    );
    if (!rolesRes.ok) return false;
    const roles = await rolesRes.json();
    return Array.isArray(roles) && roles.some((r: { role: string }) => r.role === "admin");
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate Supabase admin
  const isAdmin = await validateAdmin(req.headers.authorization);
  if (!isAdmin) {
    return res.status(401).json({ error: "Unauthorized — admin role required" });
  }

  const { endpoint, method = "GET", body } = req.body as {
    endpoint: string;
    method?: string;
    body?: unknown;
  };

  if (!endpoint || typeof endpoint !== "string") {
    return res.status(400).json({ error: "Missing endpoint" });
  }

  // Prevent path traversal — only allow /api/ and /auth/ paths
  if (!endpoint.startsWith("/api/") && !endpoint.startsWith("/auth/")) {
    return res.status(400).json({ error: "Invalid endpoint" });
  }

  try {
    const token = await getXforgeToken();

    const fetchOpts: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    if (body && method !== "GET") {
      fetchOpts.body = JSON.stringify(body);
    }

    let response = await fetch(`${XFORGE_URL}${endpoint}`, fetchOpts);

    // Auto-retry on 401 (token expired)
    if (response.status === 401) {
      cachedToken = null;
      const newToken = await getXforgeToken();
      (fetchOpts.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
      response = await fetch(`${XFORGE_URL}${endpoint}`, fetchOpts);
    }

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    return res.status(response.status).json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Proxy error";
    console.error("xforge-proxy error:", message);
    return res.status(502).json({ error: message });
  }
}
