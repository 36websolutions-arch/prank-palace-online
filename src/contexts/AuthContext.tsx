import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type CitizenTier = "plebeian" | "citizen" | "senator" | "consul" | "emperor";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  nickname: string | null;
  isAdmin: boolean;
  citizenTier: CitizenTier;
  totalDonated: number;
  signUp: (email: string, password: string, nickname: string, phone?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [citizenTier, setCitizenTier] = useState<CitizenTier>("citizen");
  const [totalDonated, setTotalDonated] = useState(0);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setNickname(null);
          setIsAdmin(false);
          setCitizenTier("citizen");
          setTotalDonated(0);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("nickname, citizen_tier, total_donated")
        .eq("id", userId)
        .maybeSingle();

      if (profile) {
        setNickname(profile.nickname);
        setCitizenTier((profile.citizen_tier as CitizenTier) || "citizen");
        setTotalDonated(profile.total_donated || 0);
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (roles) {
        setIsAdmin(roles.some(r => r.role === "admin"));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  const signUp = async (email: string, password: string, nickname: string, phone?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          nickname,
          phone,
        },
      },
    });
    
    return { error: error as Error | null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    // Clear local state first to ensure UI updates even if server call fails
    setUser(null);
    setSession(null);
    setNickname(null);
    setIsAdmin(false);
    setCitizenTier("citizen");
    setTotalDonated(0);

    // Then attempt server signout (may fail if session already expired)
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log("Signout completed (session may have already expired)");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        nickname,
        isAdmin,
        citizenTier,
        totalDonated,
        signUp,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
