import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowDown, Gift, Check, Users, Flame, MessageSquare } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { subscribeToBeehiiv } from "@/lib/beehiiv";
import { PROMO_CODE } from "@/lib/promo";

export default function Join() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

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
            {/* Section 1: Outcome hook — mobile-first, big and bold */}
            <section className="px-4 pt-10 pb-6 text-center">
              {/* Tappable CTA badge — scrolls to form */}
              <motion.button
                onClick={scrollToForm}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/40 text-amber-400 px-5 py-2 rounded-full text-sm font-bold mb-6 active:scale-95 transition-transform"
              >
                <Gift className="h-4 w-4" />
                50% Off — Tap to Claim
                <ArrowDown className="h-3.5 w-3.5 animate-bounce" />
              </motion.button>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl mb-4 leading-tight"
              >
                Be the funniest person<br />
                <span className="text-amber-500">in the group chat.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-stone-400 text-base sm:text-lg max-w-sm mx-auto"
              >
                Join 18,000+ people who send prank gifts that get them blocked and thanked in the same text.
              </motion.p>
            </section>

            {/* Section 2: Social proof — outcomes, not features */}
            <section className="px-4 pb-8">
              <div className="flex justify-center gap-6 sm:gap-10 max-w-md mx-auto">
                {[
                  { icon: Users, value: "18K+", label: "People in on it" },
                  { icon: Flame, value: "2,847+", label: "Friends roasted" },
                  { icon: MessageSquare, value: "4.9/5", label: "\"Worth the block\"" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center">
                    <Icon className="h-5 w-5 text-amber-500/70 mx-auto mb-1" />
                    <p className="text-xl font-bold text-stone-100">{value}</p>
                    <p className="text-xs text-stone-500">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: What happens when you join — outcomes not deliverables */}
            <section className="px-4 pb-8">
              <div className="max-w-sm mx-auto space-y-3">
                {[
                  "You send a gift that makes someone laugh so hard they forgive you for the packaging",
                  "You find the memes before everyone else and become the group chat legend",
                  "You get 50% off the most savage prank gifts on the internet",
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex items-start gap-3 bg-stone-900/50 border border-stone-800/50 rounded-lg p-3"
                  >
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-amber-400" />
                    </div>
                    <p className="text-stone-300 text-sm">{item}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section 4: Email capture — THE CTA, prominent on mobile */}
            <section className="px-4 pb-10" ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-md mx-auto"
              >
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center">
                  <h2 className="font-display text-2xl sm:text-3xl mb-2">
                    Get <span className="text-amber-500">50% Off</span>
                  </h2>
                  <p className="text-stone-400 text-sm mb-5">
                    Your first 5 orders. Drop your email and the code is yours.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                      type="email"
                      placeholder="citizen@empire.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-stone-800 border-stone-700 h-14 text-base text-stone-100 placeholder:text-stone-500 focus:border-amber-500 rounded-xl"
                    />
                    <Button
                      type="submit"
                      disabled={subscribing}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 h-14 text-base font-bold group rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all"
                    >
                      {subscribing ? "Joining..." : "Send Me the Code"}
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>

                  <p className="text-xs text-stone-600 mt-3">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* Section 5: Quick testimonial */}
            <section className="px-4 pb-10">
              <div className="max-w-sm mx-auto text-center">
                <p className="text-stone-500 text-sm italic">
                  "Sent this to my roommate. Offended for 5 minutes, then asked where to get cologne this good."
                </p>
                <p className="text-stone-600 text-xs mt-2">— Jake M., verified buyer</p>
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
                You're in.
              </h2>

              <p className="text-stone-400 text-lg mb-8">
                Here's your code. Use it before your friends find out.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-stone-900 border-2 border-dashed border-amber-500/50 rounded-xl p-6 mb-8 max-w-sm mx-auto"
              >
                <p className="text-xs text-amber-400 uppercase tracking-wider mb-2">Your Code</p>
                <p className="font-mono text-3xl font-bold text-amber-400 tracking-widest">{PROMO_CODE}</p>
                <p className="text-sm text-stone-500 mt-2">50% off &middot; first 5 orders &middot; excludes shipping</p>
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
