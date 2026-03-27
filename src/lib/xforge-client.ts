import { supabase } from "@/integrations/supabase/client";

async function xforgeApi<T = unknown>(
  endpoint: string,
  method: string = "GET",
  body?: unknown,
): Promise<T> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch("/api/xforge-proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ endpoint, method, body }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Types ──

export interface QueueItem {
  id: string;
  account_id: string;
  persona_name: string;
  generated_text: string;
  target_tweet_id: string | null;
  target_tweet_text: string | null;
  target_author: string | null;
  status: "pending" | "approved" | "rejected" | "posted" | "failed";
  created_at: string;
  reviewed_at: string | null;
  posted_at: string | null;
  error_message: string | null;
}

export interface QueueResponse {
  data: QueueItem[];
  total: number;
  page: number;
  limit: number;
}

export interface StatsRow {
  action_type: string;
  total: number;
  successes: number;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  tone: string;
  openerTemplates: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  accountId: string;
  username: string;
  actionType: string;
  result: string;
  durationMs: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AuditLogResponse {
  data: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface Schedule {
  id: string;
  name: string;
  account_id: string;
  persona_name: string;
  cron: string;
  enabled: boolean;
  next_run: string | null;
}

// ── Convenience helpers ──

const ACCOUNT_ID = "7941c0e5-70cf-4c8f-ac01-df6511556a23";

export function getQueue(status?: string, page = 1, limit = 20): Promise<QueueResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status && status !== "all") params.set("status", status);
  return xforgeApi(`/api/reply-bot/queue?${params}`);
}

export function approveQueueItem(id: string): Promise<unknown> {
  return xforgeApi("/api/reply-bot/approve", "POST", { id, action: "approve" });
}

export function rejectQueueItem(id: string): Promise<unknown> {
  return xforgeApi("/api/reply-bot/approve", "POST", { id, action: "reject" });
}

export function postTweet(text: string): Promise<unknown> {
  return xforgeApi("/api/reply-bot/tweet", "POST", { accountId: ACCOUNT_ID, text });
}

export function generateTweet(personaId: string, topic?: string): Promise<{ text: string }> {
  return xforgeApi("/api/reply-bot/generate", "POST", {
    personaId,
    topic,
    accountId: ACCOUNT_ID,
  });
}

export function getStats(): Promise<StatsRow[]> {
  return xforgeApi("/api/reply-bot/stats");
}

export function getPersonas(): Promise<{ data: Persona[] }> {
  return xforgeApi("/api/personas");
}

export function updatePersona(name: string, template: Record<string, unknown>): Promise<unknown> {
  return xforgeApi("/api/personas", "POST", { name, template });
}

export function getHistory(
  params: { page?: number; limit?: number; type?: string; from?: string; to?: string } = {},
): Promise<AuditLogResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.type) qs.set("type", params.type);
  if (params.from) qs.set("from", params.from);
  if (params.to) qs.set("to", params.to);
  qs.set("accountId", ACCOUNT_ID);
  return xforgeApi(`/api/audit-log?${qs}`);
}

export function getSchedules(): Promise<{ data: Schedule[] }> {
  return xforgeApi("/api/reply-bot/schedules");
}
