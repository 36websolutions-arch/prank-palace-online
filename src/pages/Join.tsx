import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Shield, Truck, Star, Gift, Check } from "lucide-react";
import { subscribeToBeehiiv } from "@/lib/beehiiv";
import { PROMO_CODE } from "@/lib/promo";

export default function Join() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribing) return;
    setSubscribing(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: email.trim(),
      });
      if (error && error.code === "23505") {
        // Already subscribed — still show the code
        setSubscribed(true);
      } else if (error) {
        throw error;
      } else {
        subscribeToBeehiiv(email.trim());
        setSubscribed(true);
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Minimal header */}
      <header className="py-6 px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
          <img src="/logo.png" alt="Corporate Pranks" className="h-8 w-8" />
          <span className="font-display text-lg">CorporatePranks</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full">
          {!subscribed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              {/* Hero badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
              >
                <Gift className="h-4 w-4" />
                Exclusive Offer
              </motion.div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-4 leading-tight">
                Get <span className="text-amber-500">50% Off</span> Your First 5 Orders
              </h1>

              <p className="text-stone-400 text-lg mb-8 max-w-md mx-auto">
                Join the Prank Letter and receive exclusive content, discounts, and dispatches from the Corporate Empire.
              </p>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
                <Input
                  type="email"
                  placeholder="citizen@empire.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-stone-900 border-stone-700 h-14 text-base text-stone-100 placeholder:text-stone-500 focus:border-amber-500"
                />
                <Button
                  type="submit"
                  disabled={subscribing}
                  className="bg-amber-500 hover:bg-amber-600 text-stone-950 px-8 h-14 text-base font-bold group"
                >
                  {subscribing ? "Joining..." : "Join Now"}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

              <p className="text-xs text-stone-500 mb-12">
                No spam. Unsubscribe anytime. Just satire, discounts, and historically accurate insults.
              </p>

              {/* Trust signals */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-md mx-auto">
                {[
                  { icon: Shield, label: "Secure Checkout" },
                  { icon: Truck, label: "Ships in 24hrs" },
                  { icon: Star, label: "4.9/5 Rating" },
                  { icon: Gift, label: "Real Cologne" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-stone-500">
                    <Icon className="h-5 w-5 text-amber-500/60" />
                    <span className="text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* Success state — reveal the code */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="h-8 w-8 text-green-400" />
              </motion.div>

              <h2 className="font-display text-3xl sm:text-4xl mb-4">
                Welcome to the Senate
              </h2>

              <p className="text-stone-400 text-lg mb-8">
                Your exclusive promo code is ready. Use it on your next 5 orders:
              </p>

              {/* Promo code display */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-stone-900 border-2 border-dashed border-amber-500/50 rounded-xl p-6 mb-8 max-w-sm mx-auto"
              >
                <p className="text-xs text-amber-400 uppercase tracking-wider mb-2">Your Code</p>
                <p className="font-mono text-3xl font-bold text-amber-400 tracking-widest">{PROMO_CODE}</p>
                <p className="text-sm text-stone-500 mt-2">50% off product price &middot; excludes shipping</p>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(PROMO_CODE);
                    alert("Code copied!");
                  }}
                  variant="outline"
                  className="mt-4 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  size="sm"
                >
                  Copy Code
                </Button>
              </motion.div>

              {/* Product CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/you-smell-like-shit">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold px-6">
                    Shop "You Smell Like Shit" Cologne
                  </Button>
                </Link>
                <Link to="/your-breath-stinks">
                  <Button variant="outline" className="border-stone-700 text-stone-300 hover:border-amber-500 px-6">
                    Shop "Your Breath Stinks" Mints
                  </Button>
                </Link>
              </div>

              <Link
                to="/armory"
                className="inline-block mt-6 text-sm text-stone-500 hover:text-amber-400 transition-colors"
              >
                Browse the full Armory &rarr;
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="py-6 px-6 text-center text-xs text-stone-600">
        &copy; {new Date().getFullYear()} CorporatePranks. Satire Since Rome.
      </footer>
    </div>
  );
}
