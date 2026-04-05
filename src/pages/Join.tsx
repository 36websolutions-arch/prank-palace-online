import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ArrowDown, Check, Star, Shield, Truck, Gift } from "lucide-react";
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
      <header className="py-3 px-6 border-b border-stone-900">
        <Link to="/" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition-colors">
          <img src={logoImg} alt="Corporate Pranks" className="h-8 w-8 rounded-full" />
          <span className="font-display text-lg">CorporatePranks</span>
        </Link>
      </header>

      <main className="flex-1">
        {!subscribed ? (
          <>
            {/* Hero: Product + Offer — above the fold on mobile */}
            <section className="px-4 pt-6 pb-4">
              <div className="max-w-md mx-auto">
                {/* Product image */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative mb-5"
                >
                  <img
                    src="/products/you-smell-like-shit/hero-1.webp"
                    alt="You Smell Like Shit - Solid Cologne Gift Set"
                    className="w-full rounded-xl border border-stone-800"
                  />
                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-amber-500 text-stone-950 font-black text-sm px-3 py-1.5 rounded-lg shadow-lg">
                    50% OFF
                  </div>
                </motion.div>

                {/* Headline + price */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="text-center mb-4"
                >
                  <h1 className="font-display text-2xl sm:text-3xl mb-1 leading-tight">
                    Your friend needs this.
                  </h1>
                  <p className="text-stone-400 text-base">
                    Real cologne. Real insults. Real reactions.
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <span className="text-2xl font-bold text-amber-500">$9.99</span>
                    <span className="text-lg text-stone-500 line-through">$19.99</span>
                    <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded">SAVE $10</span>
                  </div>
                </motion.div>

                {/* CTA button — scrolls to form */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <Button
                    onClick={scrollToForm}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 h-14 text-base font-black tracking-wide rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    GET 50% OFF
                    <ArrowDown className="h-4 w-4 ml-2 animate-bounce" />
                  </Button>
                </motion.div>
              </div>
            </section>

            {/* Trust badges */}
            <section className="px-4 pb-4">
              <div className="flex justify-center gap-6 max-w-md mx-auto">
                {[
                  { icon: Shield, label: "Secure Checkout" },
                  { icon: Truck, label: "Ships in 24hrs" },
                  { icon: Star, label: "4.9/5 Rating" },
                  { icon: Gift, label: "Anonymous Delivery" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="text-center">
                    <Icon className="h-4 w-4 text-amber-500/60 mx-auto mb-0.5" />
                    <span className="text-[10px] text-stone-500">{label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Social proof — real reviews */}
            <section className="px-4 pb-6">
              <div className="max-w-md mx-auto space-y-3">
                {[
                  { text: "Sent this to my roommate. Offended for 5 minutes, then asked where to get cologne this good.", author: "Jake M." },
                  { text: "My brother hasn't spoken to me in 3 days. Worth it. The cologne actually smells amazing.", author: "Sarah T." },
                  { text: "Bought 6 packs. My entire friend group smells better AND hates me.", author: "Marcus D." },
                ].map((review, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="bg-stone-900/50 border border-stone-800/50 rounded-lg p-3"
                  >
                    <div className="flex gap-0.5 mb-1">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <p className="text-stone-300 text-sm italic">"{review.text}"</p>
                    <p className="text-stone-600 text-xs mt-1">{review.author}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Email capture — THE FORM */}
            <section className="px-4 pb-8" ref={formRef}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-md mx-auto"
              >
                <div className="bg-stone-900 border-2 border-amber-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_40px_rgba(245,158,11,0.15)]">
                  <h2 className="font-display text-xl sm:text-2xl mb-1">
                    Get your <span className="text-amber-500">50% off</span> code
                  </h2>
                  <p className="text-stone-400 text-sm mb-5">
                    Drop your email. We'll send the code instantly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-stone-800 border-stone-700 h-14 text-base text-stone-100 placeholder:text-stone-500 focus:border-amber-500 rounded-xl"
                    />
                    <Button
                      type="submit"
                      disabled={subscribing}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 h-16 text-lg font-black tracking-wide group rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {subscribing ? "SENDING..." : "SEND ME THE CODE"}
                      <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>

                  <p className="text-xs text-stone-600 mt-3">
                    No spam. Unsubscribe anytime.
                  </p>
                </div>
              </motion.div>
            </section>

            {/* What's in the box */}
            <section className="px-4 pb-10 border-t border-stone-900 pt-6">
              <div className="max-w-md mx-auto">
                <h3 className="text-center text-xs font-medium text-stone-500 uppercase tracking-wider mb-4">What's in the box</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "2 solid cologne tins (actually smells incredible)",
                    "1 savage greeting card (15 options or write your own)",
                    "Anonymous shipping (no return address)",
                    "The look on their face (priceless)",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <p className="text-stone-400 text-xs">{item}</p>
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

              <Link to="/you-smell-like-shit">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold px-8 h-14 text-base rounded-xl">
                  Shop Now with 50% Off
                </Button>
              </Link>

              <Link
                to="/armory"
                className="inline-block mt-4 text-sm text-stone-500 hover:text-amber-400 transition-colors"
              >
                Browse all products &rarr;
              </Link>
            </motion.div>
          </div>
        )}
      </main>

      <footer className="py-4 px-6 text-center text-xs text-stone-600">
        &copy; {new Date().getFullYear()} CorporatePranks. Satire Since Rome.
      </footer>
    </div>
  );
}
