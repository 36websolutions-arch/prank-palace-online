import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export default function Unsubscribe() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [unsubEmail, setUnsubEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const unsubscribe = async () => {
      try {
        // Call edge function to verify token and unsubscribe
        const { data, error } = await supabase.functions.invoke("subscribe-beehiiv", {
          body: { action: "unsubscribe", token },
        });

        if (error || !data?.success) {
          throw new Error(data?.error || "Invalid or expired link");
        }

        setUnsubEmail(data.email || "");
        setStatus("done");
      } catch {
        setStatus("error");
      }
    };

    unsubscribe();
  }, [token]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === "loading" && (
          <p className="text-stone-400">Unsubscribing...</p>
        )}

        {status === "done" && (
          <>
            <h1 className="font-display text-3xl mb-4">You've Left the Senate</h1>
            <p className="text-stone-400 mb-8">
              You've been unsubscribed. You won't receive any more emails from us.
            </p>
            <p className="text-stone-500 text-sm mb-8">
              We'll miss you, Citizen. The Empire won't be the same.
            </p>
            <Link to="/">
              <Button className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold">
                Back to CorporatePranks
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="font-display text-3xl mb-4">Something Went Wrong</h1>
            <p className="text-stone-400 mb-8">
              This unsubscribe link is invalid or expired. Please email us at info@corporatepranks.com and we'll remove you manually.
            </p>
            <Link to="/">
              <Button className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold">
                Back to CorporatePranks
              </Button>
            </Link>
          </>
        )}
      </div>

      <footer className="absolute bottom-6 text-xs text-stone-600">
        &copy; {new Date().getFullYear()} CorporatePranks. Satire Since Rome.
      </footer>
    </div>
  );
}
