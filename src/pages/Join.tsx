import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Gift, Check, Instagram, Users, Flame } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { subscribeToBeehiiv } from "@/lib/beehiiv";
import { PROMO_CODE } from "@/lib/promo";

export default function Join() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || subscribing) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      alert("Please enter a valid email address.");
      return;
    }
    setSubscribing(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: trimmed,
      });
      if (error && error.code === "23505") {
        setSubscribed(true);
      } else if (error) {
        throw error;
      } else {
        subscribeToBeehiiv(trimmed);
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
      {/* Header */}
      <header className="py-4 px-6 border-b border-stone-900">
        <Link to="/" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
          <img src={logoImg} alt="Corporate Pranks" className="h-8 w-8 rounded-full" />
          <span className="font-display text-lg">CorporatePranks</span>
        </Link>
      </header>

      <main className="flex-1">
        {!subscribed ? (
          <>
            {/* Section 1: Hook — What is Corporate Pranks */}
            <section className="px-4 pt-10 pb-8 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl mb-3 leading-tight"
              >
                Corporate Satire.<br />
                <span className="text-amber-500">Since Rome.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-stone-400 text-base sm:text-lg max-w-md mx-auto"
              >
                Prank gifts that actually smell good, Instagram captions written by a cynical Roman historian, and dispatches from the Corporate Empire.
              </motion.p>
            </section>

            {/* Section 2: Social proof stats */}
            <section className="px-4 pb-8">
              <div className="flex justify-center gap-8 sm:gap-12 max-w-md mx-auto">
                {[
                  { icon: Users, value: "18K+", label: "Citizens" },
                  { icon: Instagram, value: "Daily", label: "Dispatches" },
                  { icon: Flame, value: "2,847+", label: "Packs Shipped" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center">
                    <Icon className="h-5 w-5 text-amber-500/70 mx-auto mb-1" />
                    <p className="text-xl font-bold text-stone-100">{value}</p>
                    <p className="text-xs text-stone-500">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Featured content — Instagram embed */}
            <section className="px-4 pb-8">
              <div className="max-w-sm mx-auto">
                <a
                  href="https://www.instagram.com/corporatepranks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-center gap-3 p-3 border-b border-stone-800">
                    <img src={logoImg} alt="" className="h-8 w-8 rounded-full" />
                    <div>
                      <p className="text-sm font-medium text-stone-100">corporatepranks</p>
                      <p className="text-xs text-stone-500">18,000+ followers</p>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-stone-400 text-sm italic mb-3">
                      "History doesn't repeat itself, but corporate America sure does."
                    </p>
                    <div className="flex items-center justify-center gap-2 text-amber-500 text-sm font-medium">
                      <Instagram className="h-4 w-4" />
                      Follow @corporatepranks
                    </div>
                  </div>
                </a>
              </div>
            </section>

            {/* Section 4: The offer + email capture */}
            <section className="px-4 pb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-md mx-auto text-center"
              >
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                  <Gift className="h-4 w-4" />
                  Exclusive Offer
                </div>

                <h2 className="font-display text-2xl sm:text-3xl mb-2">
                  Get <span className="text-amber-500">50% Off</span> Your First 5 Orders
                </h2>

                <p className="text-stone-400 text-sm mb-6">
                  Join the Prank Letter for exclusive drops, discounts, and content that would make Juvenal proud.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
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
                    {subscribing ? "Joining..." : "Get 50% Off"}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>

                <p className="text-xs text-stone-600">
                  No spam. Unsubscribe anytime. Just satire, discounts, and historically accurate insults.
                </p>
              </motion.div>
            </section>

            {/* Section 5: What you'll get */}
            <section className="px-4 pb-12 border-t border-stone-900 pt-8">
              <div className="max-w-md mx-auto">
                <h3 className="text-center text-sm font-medium text-stone-500 uppercase tracking-wider mb-6">What you'll get</h3>
                <div className="space-y-4">
                  {[
                    "50% off your first 5 orders on prank cologne and sour mints",
                    "Weekly dispatches from the Corporate Empire (Roman satire meets modern absurdity)",
                    "Early access to new product drops before they hit the site",
                    "Exclusive memes and content you won't see on Instagram",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-amber-400" />
                      </div>
                      <p className="text-stone-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Success state */
          <div className="flex-1 flex items-center justify-center px-4 py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-lg"
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
          </div>
        )}
      </main>

      <footer className="py-6 px-6 text-center text-xs text-stone-600">
        &copy; {new Date().getFullYear()} CorporatePranks. Satire Since Rome.
      </footer>
    </div>
  );
}
