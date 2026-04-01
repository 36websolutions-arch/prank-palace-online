import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { X, Gift, ArrowRight, Check } from "lucide-react";
import { subscribeToBeehiiv } from "@/lib/beehiiv";
import { PROMO_CODE } from "@/lib/promo";

const STORAGE_KEY = "cp-exit-popup-shown";

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves through the top of the viewport
    if (e.clientY > 10) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    sessionStorage.setItem(STORAGE_KEY, "1");
    setShow(true);
  }, []);

  useEffect(() => {
    // Don't show on admin or auth pages
    if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/auth")) return;
    // Don't show if already dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Wait 5 seconds before arming
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || subscribing) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
    setSubscribing(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: email.trim(),
      });
      if (error && error.code !== "23505") throw error;
      if (!error) subscribeToBeehiiv(email.trim());
      setSubscribed(true);
    } catch (err) {
      console.error("Exit popup signup error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const close = () => setShow(false);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-stone-900 border border-stone-700 rounded-2xl p-8 max-w-md w-full shadow-2xl pointer-events-auto relative">
              <button
                onClick={close}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {!subscribed ? (
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="h-6 w-6 text-amber-400" />
                  </div>

                  <h3 className="font-display text-2xl text-stone-100 mb-2">
                    Wait — Don't Leave Empty Handed
                  </h3>

                  <p className="text-stone-400 mb-6">
                    Get <span className="text-amber-400 font-bold">50% off</span> your first 5 orders when you join the Prank Letter.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4">
                    <Input
                      type="email"
                      placeholder="citizen@empire.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-stone-800 border-stone-600 h-12 text-stone-100 placeholder:text-stone-500 focus:border-amber-500"
                    />
                    <Button
                      type="submit"
                      disabled={subscribing}
                      className="bg-amber-500 hover:bg-amber-600 text-stone-950 h-12 text-base font-bold group w-full"
                    >
                      {subscribing ? "Joining..." : "Get 50% Off"}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>

                  <button
                    onClick={close}
                    className="text-xs text-stone-600 hover:text-stone-400 transition-colors"
                  >
                    No thanks, I prefer paying full price
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="h-6 w-6 text-green-400" />
                  </motion.div>

                  <h3 className="font-display text-2xl text-stone-100 mb-2">
                    Welcome, Citizen
                  </h3>

                  <p className="text-stone-400 mb-4">Your exclusive code:</p>

                  <div className="bg-stone-800 border-2 border-dashed border-amber-500/50 rounded-xl p-4 mb-6">
                    <p className="font-mono text-2xl font-bold text-amber-400 tracking-widest">{PROMO_CODE}</p>
                    <p className="text-xs text-stone-500 mt-1">50% off &middot; first 5 orders &middot; excludes shipping</p>
                  </div>

                  <Link to="/armory" onClick={close}>
                    <Button className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold w-full">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
