import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { trackAddToCart } from "@/lib/analytics";
import { ShoppingCart, Lock, Package, Star, ChevronDown, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CardOption {
  id: number;
  name: string;
  front: string;
  inside: string;
}

type ScentVariant = "desperate-attempt" | "last-resort" | "final-warning";

interface ScentInfo {
  id: ScentVariant;
  name: string;
  scents: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const SCENT_VARIANTS: ScentInfo[] = [
  { id: "desperate-attempt", name: "Desperate Attempt", scents: "Strawberry & Cream + Vanilla & Jasmine" },
  { id: "last-resort", name: "Last Resort", scents: "Lavender & Sandalwood + Bergamot & Cedarwood" },
  { id: "final-warning", name: "Final Warning", scents: "Pine & Cedar + Fresh Linen & Cotton" },
];

const CARD_OPTIONS: CardOption[] = [
  { id: 1, name: "The Intervention", front: "We Need to Talk.", inside: "It's about your smell. The group chat voted. It was unanimous. Open your gift." },
  { id: 2, name: "The Honest Friend", front: "Because Real Friends Tell the Truth...", inside: "You smell like a wet gym bag wrapped in regret. Here's some help." },
  { id: 3, name: "The Anonymous Tip", front: "FROM: Someone Who Cares", inside: "TO: Someone Who Stinks. This is your sign." },
  { id: 4, name: "The Performance Review", front: "Your Annual Review Is In.", inside: "Hygiene: Needs Improvement. Cologne: Provided. No further questions." },
  { id: 5, name: "The Breakup Letter", front: "I Can't Do This Anymore.", inside: "It's not you, it's your scent. JK it's definitely you. Use this." },
  { id: 6, name: "The Public Service", front: "On Behalf of Everyone Around You...", inside: "We pooled our resources. Please. For all of us." },
  { id: 7, name: "Roses Are Red", front: "Roses Are Red...", inside: "Violets are blue. You smell like shit. This cologne's for you." },
  { id: 8, name: "The Official Notice", front: "OFFICIAL NOTICE", inside: "You have been identified as a hazardous scent zone. This cologne has been issued for immediate deployment." },
  { id: 9, name: "The Love Letter", front: "I Love You But...", inside: "I can't keep pretending you smell good. You don't. Here's cologne. Still love you though." },
  { id: 10, name: "The Group Chat", front: "This Message Was Approved By:", inside: "Everyone. Literally everyone. Even your mom. Open the box." },
  { id: 11, name: "The Prescription", front: "PRESCRIPTION", inside: "Patient: You. Diagnosis: Smells Like Shit. Treatment: Apply immediately. Refills: Unlimited." },
  { id: 12, name: "Emergency Services", front: "EMERGENCY ALERT", inside: "Multiple complaints received about a suspicious odor. The source: you. Here's the cure." },
  { id: 13, name: "Congratulations", front: "Congratulations!", inside: "You've been voted Most Likely to Clear a Room. Here's your prize." },
  { id: 14, name: "The Apology", front: "I'm Sorry...", inside: "...that nobody told you sooner. You smell terrible. But now you have cologne. We're good." },
  { id: 15, name: "The Simple Truth", front: "No Easy Way to Say This.", inside: "You smell like shit. Here's some cologne. You're welcome." },
  { id: 16, name: "Custom Message", front: "", inside: "" },
];

const REVIEWS = [
  { stars: 5, text: "Sent this to my roommate. Offended for 5 minutes, then asked where to get cologne this good.", author: "Jake M." },
  { stars: 5, text: "My brother hasn't spoken to me in 3 days. Worth it. The cologne actually smells amazing.", author: "Sarah T." },
  { stars: 5, text: "Bought 6 packs. My entire friend group smells better AND hates me.", author: "Marcus D." },
  { stars: 5, text: "The card said 'We Need to Talk.' My boyfriend thought I was breaking up with him. Best gift ever.", author: "Ashley R." },
  { stars: 5, text: "Bought it as a joke. The cologne is genuinely fire though. 10/10 would insult again.", author: "Tyler K." },
];

const FAQ_ITEMS = [
  {
    q: "Is this real cologne or a joke product?",
    a: "Both! The packaging and card are hilarious, but the solid colognes inside are genuinely premium fragrances made with quality ingredients. Your friend will laugh first, then actually wear it."
  },
  {
    q: "What scents are available?",
    a: "Three packs: \"Desperate Attempt\" (Strawberry & Cream + Vanilla & Jasmine), \"Last Resort\" (Lavender & Sandalwood + Bergamot & Cedarwood), and \"Final Warning\" (Pine & Cedar + Fresh Linen & Cotton). Each pack includes two solid cologne tins."
  },
  {
    q: "Can I ship it directly to someone anonymously?",
    a: "Absolutely. Enter their address at checkout and we'll ship it with no return address. They'll have no idea who sent it (unless your card message gives it away)."
  },
  {
    q: "Can I customize the card message?",
    a: "Yes! Choose from 15 pre-written savage roasts, or select \"Custom Message\" to write your own front and inside text. Get creative."
  },
  {
    q: "What if they don't find it funny?",
    a: "They will. But if for some reason they don't, they still get premium cologne out of it. Win-win. We offer a 30-day satisfaction guarantee — contact us if there's any issue."
  },
  {
    q: "How long does shipping take?",
    a: "Orders ship within 24 hours. Standard delivery is 3-5 business days. Expedited options are available at checkout."
  },
  {
    q: "Is this safe for sensitive skin?",
    a: "Yes. Our solid colognes are made with natural carrier oils and are dermatologist-tested. They're alcohol-free and gentle on skin. If irritation occurs, discontinue use."
  },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

function useAnimatedCounter(target: number, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target, duration, trigger]);

  return count;
}

// ─── Sub-Components ─────────────────────────────────────────────────────────────

function FadeUp({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function GlowButton({
  children,
  onClick,
  className = "",
  size = "lg",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative font-bold uppercase tracking-wider rounded-xl
        bg-gradient-to-r from-amber-500 to-orange-500
        text-white shadow-[0_0_30px_rgba(245,158,11,0.4)]
        hover:shadow-[0_0_50px_rgba(245,158,11,0.6)]
        hover:scale-[1.03] active:scale-[0.98]
        transition-all duration-300
        animate-subtle-pulse
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function YouSmellLikeShit() {
  const navigate = useNavigate();

  // State
  const [selectedScent, setSelectedScent] = useState<ScentVariant>("desperate-attempt");
  const [selectedCard, setSelectedCard] = useState<number>(1);
  const [customFront, setCustomFront] = useState("");
  const [customInside, setCustomInside] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);
  const [heroImage, setHeroImage] = useState(0);
  const [viewingCount, setViewingCount] = useState(27);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [bundleQty, setBundleQty] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);

  const heroImages = [
    "/products/you-smell-like-shit/hero-1.png",
    "/products/you-smell-like-shit/hero-3.png",
    "/products/you-smell-like-shit/hero-5.png",
  ];

  // Viewing counter randomizer
  useEffect(() => {
    const interval = setInterval(() => {
      setViewingCount(Math.floor(Math.random() * 31) + 15);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sticky bar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyBar(heroBottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImage(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Pricing
  const getBundlePrice = (qty: number) => {
    if (qty >= 3) return 49.99;
    if (qty >= 2) return 34.99;
    return 19.99;
  };

  const getComparePrice = (qty: number) => {
    if (qty >= 3) return 59.97;
    if (qty >= 2) return 39.98;
    return 29.99;
  };

  const getSavings = (qty: number) => {
    return (getComparePrice(qty) - getBundlePrice(qty)).toFixed(2);
  };

  // Save selections and go straight to checkout (no cart)
  const handleCheckout = (overrideQty?: number) => {
    const qty = overrideQty ?? bundleQty;
    const card = CARD_OPTIONS.find(c => c.id === selectedCard);
    const scent = SCENT_VARIANTS.find(s => s.id === selectedScent);

    localStorage.setItem("yslsOrder", JSON.stringify({
      productName: "You Smell Like Shit - Solid Cologne Gift Set",
      scentVariant: scent?.name,
      scentId: scent?.id,
      cardId: selectedCard,
      cardName: card?.name,
      cardFront: selectedCard === 16 ? customFront : card?.front,
      cardInside: selectedCard === 16 ? customInside : card?.inside,
      bundleQty: qty,
      unitPrice: 19.99,
      totalPrice: getBundlePrice(qty),
      comparePrice: getComparePrice(qty),
      image: "/products/you-smell-like-shit/hero-1.png",
    }));

    trackAddToCart("You Smell Like Shit - Solid Cologne Gift Set", getBundlePrice(qty));
    navigate("/checkout?from=ysls");
  };

  const currentCard = CARD_OPTIONS.find(c => c.id === selectedCard)!;

  return (
    <div className="min-h-screen bg-stone-950 text-white overflow-x-hidden">
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.4); }
          50% { box-shadow: 0 0 50px rgba(245,158,11,0.6); }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 2.5s ease-in-out infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes card-flip {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(180deg); }
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* ═══ A. Announcement Bar ═══ */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 text-sm font-bold tracking-wide px-4">
              <span>FREE SHIPPING ON 2+ PACKS</span>
              <span className="text-amber-200">•</span>
              <span>2,847+ PACKS SHIPPED</span>
              <span className="text-amber-200">•</span>
              <span>THE GAG GIFT THAT ACTUALLY SMELLS GOOD</span>
              <span className="text-amber-200">•</span>
              <span>FREE SHIPPING ON 2+ PACKS</span>
              <span className="text-amber-200">•</span>
              <span>2,847+ PACKS SHIPPED</span>
              <span className="text-amber-200">•</span>
              <span>THE GAG GIFT THAT ACTUALLY SMELLS GOOD</span>
              <span className="text-amber-200 mr-8">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ Minimal Header ═══ */}
      <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="text-amber-500">CORPORATE</span>
            <span className="text-stone-400"> PRANKS</span>
          </Link>
          <Link to="/cart" className="relative p-2 text-stone-400 hover:text-amber-500 transition-colors">
            <ShoppingCart className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* ═══ B. Hero Section ═══ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center py-12 lg:py-20">
        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left — Product Image */}
          <FadeUp>
            <div className="relative">
              <div className="animate-float">
                <div className="relative aspect-square max-w-lg mx-auto bg-stone-900 rounded-2xl overflow-hidden border border-stone-800">
                  {heroImages.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`Product view ${i + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                        i === heroImage ? "opacity-100" : "opacity-0"
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ))}
                  {/* Fallback if no images */}
                  <div className="absolute inset-0 flex items-center justify-center text-8xl">
                    💎
                  </div>
                </div>
              </div>
              {/* Image dots */}
              <div className="flex justify-center gap-2 mt-4">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === heroImage ? "bg-amber-500 w-8" : "bg-stone-600 hover:bg-stone-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Right — Product Info */}
          <FadeUp delay={0.2}>
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-sm font-bold">
                <Star className="h-4 w-4 fill-amber-400" />
                THE #1 GAG GIFT OF 2025
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
                YOUR FRIEND SMELLS LIKE{" "}
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  SHIT.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-stone-400 italic font-serif">
                Do them a favor. Send this.
              </p>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-white">${getBundlePrice(bundleQty).toFixed(2)}</span>
                <span className="text-xl text-stone-500 line-through">${getComparePrice(bundleQty).toFixed(2)}</span>
                <span className="bg-red-500/20 text-red-400 text-sm font-bold px-3 py-1 rounded-full">
                  SAVE ${getSavings(bundleQty)}
                </span>
              </div>

              {/* Viewing counter */}
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span>{viewingCount} people are viewing this right now</span>
              </div>

              {/* Scent Variant Selector */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-stone-300 uppercase tracking-wider">Choose Your Pack</label>
                <div className="flex flex-wrap gap-2">
                  {SCENT_VARIANTS.map(scent => (
                    <button
                      key={scent.id}
                      onClick={() => setSelectedScent(scent.id)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                        selectedScent === scent.id
                          ? "bg-amber-500/20 border-amber-500 text-amber-400"
                          : "bg-stone-800/50 border-stone-700 text-stone-300 hover:border-stone-500"
                      }`}
                    >
                      <div className="font-bold">{scent.name}</div>
                      <div className="text-xs opacity-70 mt-0.5">{scent.scents}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Message Quick Select */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-stone-300 uppercase tracking-wider">Pick Your Roast</label>
                <div className="relative">
                  <select
                    value={selectedCard}
                    onChange={(e) => { setSelectedCard(Number(e.target.value)); setCardFlipped(false); }}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:border-amber-500 focus:outline-none transition-colors"
                  >
                    {CARD_OPTIONS.map(card => (
                      <option key={card.id} value={card.id}>
                        {card.id === 16 ? "Custom Message — Write Your Own" : `${card.name} — "${card.front}"`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Custom message fields */}
              {selectedCard === 16 && (
                <div className="space-y-3 bg-stone-900/50 border border-stone-800 rounded-xl p-4">
                  <div>
                    <label className="text-xs font-bold text-stone-400 uppercase">Card Front</label>
                    <input
                      type="text"
                      placeholder="Write your front message..."
                      value={customFront}
                      onChange={(e) => setCustomFront(e.target.value)}
                      maxLength={60}
                      className="w-full mt-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-400 uppercase">Card Inside</label>
                    <textarea
                      placeholder="Write your inside message..."
                      value={customInside}
                      onChange={(e) => setCustomInside(e.target.value)}
                      maxLength={200}
                      rows={2}
                      className="w-full mt-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder:text-stone-500 focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              <GlowButton onClick={() => handleCheckout()} className="w-full" size="xl">
                SEND THE MESSAGE — ${getBundlePrice(bundleQty).toFixed(2)}
              </GlowButton>

              {/* Trust Row */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-400">
                <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Secure Checkout</span>
                <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Ships in 24hrs</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 4.9/5 Rating</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Real Cologne</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══ C. Social Proof Bar ═══ */}
      <SocialProofBar />

      {/* ═══ D. How It Works ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-4 tracking-tight">
              HOW IT <span className="text-amber-400">WORKS</span>
            </h2>
            <p className="text-stone-400 text-center text-lg mb-16 max-w-xl mx-auto">
              Three steps to becoming the funniest person in their life.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Pick Your Pack", desc: "Choose scents. Pick a savage card message. Or write your own." },
              { icon: "📦", title: "We Ship It", desc: "Straight to your friend's door. Anonymously. No return address." },
              { icon: "😂", title: "They Open It", desc: "They read the card. They see the packaging. They die laughing. Then they smell amazing." },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="text-center bg-stone-900/50 border border-stone-800 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300">
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <div className="text-xs text-amber-500 font-bold tracking-widest mb-3">STEP {i + 1}</div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-stone-400 leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ E. Card Showcase ═══ */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-4 tracking-tight">
              PICK YOUR <span className="text-amber-400">ROAST</span>
            </h2>
            <p className="text-stone-400 text-center text-lg mb-16">
              15 pre-written cards. Or write your own masterpiece.
            </p>
          </FadeUp>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Card Preview */}
            <FadeUp>
              <div className="perspective-1000 max-w-md mx-auto">
                <div
                  className="relative w-full aspect-[3/4] cursor-pointer"
                  onClick={() => setCardFlipped(!cardFlipped)}
                >
                  {/* Front */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 border-2 border-amber-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                      cardFlipped ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    <div className="text-xs text-amber-500 font-bold tracking-widest mb-6">FRONT</div>
                    <p className="text-2xl sm:text-3xl font-bold italic leading-tight">
                      {selectedCard === 16
                        ? (customFront || "Your message here...")
                        : `"${currentCard.front}"`}
                    </p>
                    <div className="absolute bottom-6 text-xs text-stone-500">Tap to flip</div>
                  </div>

                  {/* Inside */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 border-2 border-amber-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                      cardFlipped ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-95"
                    }`}
                  >
                    <div className="text-xs text-amber-500 font-bold tracking-widest mb-6">INSIDE</div>
                    <p className="text-lg sm:text-xl text-stone-300 leading-relaxed italic">
                      {selectedCard === 16
                        ? (customInside || "Your inside message here...")
                        : `"${currentCard.inside}"`}
                    </p>
                    <div className="absolute bottom-6 text-xs text-stone-500">Tap to flip back</div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Card List */}
            <FadeUp delay={0.2}>
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                {CARD_OPTIONS.map(card => (
                  <button
                    key={card.id}
                    onClick={() => { setSelectedCard(card.id); setCardFlipped(false); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      selectedCard === card.id
                        ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                        : "bg-stone-900/50 border-stone-800 hover:border-stone-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedCard === card.id ? "border-amber-500 bg-amber-500" : "border-stone-600"
                      }`}>
                        {selectedCard === card.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-white">
                          {card.id === 16 ? "Custom Message" : card.name}
                        </div>
                        {card.id !== 16 && (
                          <div className="text-xs text-stone-400 mt-1 truncate">
                            "{card.front}" → "{card.inside.slice(0, 50)}..."
                          </div>
                        )}
                        {card.id === 16 && (
                          <div className="text-xs text-stone-400 mt-1">Write your own front & inside message</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══ F. Bundle Pricing ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-4 tracking-tight">
              CHOOSE YOUR <span className="text-amber-400">BURN</span>
            </h2>
            <p className="text-stone-400 text-center text-lg mb-16">
              More packs = more savings. Roast the whole crew.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                qty: 1, name: "The Casual Roast", desc: "Send to one friend",
                price: 19.99, compare: 29.99, badge: null, popular: false,
              },
              {
                qty: 2, name: "The Double Burn", desc: "FREE SHIPPING",
                price: 34.99, compare: 39.98, badge: "MOST POPULAR", popular: true,
              },
              {
                qty: 3, name: "The Full Intervention", desc: "FREE SHIPPING",
                price: 49.99, compare: 59.97, badge: "BEST VALUE", popular: false,
              },
            ].map((tier, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className={`relative rounded-2xl border p-6 text-center transition-all duration-300 hover:scale-[1.02] ${
                  tier.popular
                    ? "bg-gradient-to-b from-amber-500/10 to-stone-900 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
                    : "bg-stone-900/50 border-stone-800 hover:border-stone-600"
                }`}>
                  {tier.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                      tier.popular ? "bg-amber-500 text-stone-950" : "bg-stone-700 text-stone-200"
                    }`}>
                      {tier.badge}
                    </div>
                  )}

                  <div className="text-4xl mb-3">{tier.qty === 1 ? "🎯" : tier.qty === 2 ? "🔥" : "💣"}</div>
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <p className="text-sm text-stone-400 mb-4">{tier.desc}</p>

                  <div className="mb-6">
                    <span className="text-3xl font-black">${tier.price.toFixed(2)}</span>
                    <span className="text-stone-500 line-through ml-2">${tier.compare.toFixed(2)}</span>
                  </div>

                  <div className="text-xs text-stone-500 mb-4">
                    {tier.qty} {tier.qty === 1 ? "pack" : "packs"} • {tier.qty * 2} cologne tins • {tier.qty} {tier.qty === 1 ? "card" : "cards"}
                  </div>

                  <GlowButton
                    onClick={() => handleCheckout(tier.qty)}
                    className="w-full"
                    size="md"
                  >
                    {tier.qty === 1 ? "SEND THE MESSAGE" : `GET ${tier.qty} PACKS`}
                  </GlowButton>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ G. Why This Gift? ═══ */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-16 tracking-tight">
              WHY THIS <span className="text-amber-400">GIFT?</span>
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: "✨", title: "Actually Premium Cologne", desc: "Not a prank product. Real solid fragrances that smell incredible." },
              { icon: "😂", title: "The Reaction Is Priceless", desc: "Worth every penny just for the look on their face." },
              { icon: "💌", title: "Savage Card Included", desc: "15 pre-written roasts or write your own. Free with every pack." },
              { icon: "🕵️", title: "Anonymous Shipping", desc: "No return address. They'll never know who did it." },
            ].map((feature, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="flex gap-5 bg-stone-900/50 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
                  <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-stone-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ H. Reviews ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black uppercase mb-4 tracking-tight">
                WHAT PEOPLE <span className="text-amber-400">SAY</span>
              </h2>
              <div className="flex items-center justify-center gap-2 text-lg">
                <StarRating />
                <span className="text-stone-400">4.9/5 from 2,847+ reviews</span>
              </div>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300">
                  <StarRating count={review.stars} />
                  <p className="text-stone-300 mt-4 mb-4 italic leading-relaxed">
                    "{review.text}"
                  </p>
                  <p className="text-sm font-bold text-stone-500">— {review.author}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ I. FAQ ═══ */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-16 tracking-tight">
              STILL GOT <span className="text-amber-400">QUESTIONS?</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-stone-900/50 border border-stone-800 rounded-xl px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-bold text-white hover:text-amber-400 hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-400 leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>

      {/* ═══ J. Final CTA ═══ */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeUp>
            <div className="text-7xl mb-8">✨</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase mb-4 tracking-tight">
              STILL THINKING?
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-amber-400 mb-3">
              YOUR FRIEND STILL STINKS.
            </p>
            <p className="text-xl text-stone-400 italic font-serif mb-10">
              Do the right thing.
            </p>

            <GlowButton onClick={() => handleCheckout()} className="w-full max-w-md mx-auto" size="xl">
              SEND THE MESSAGE — $19.99
            </GlowButton>

            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-stone-500">
              <span>Ships in 24hrs</span>
              <span>•</span>
              <span>30-day guarantee</span>
              <span>•</span>
              <span>Anonymous delivery</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-stone-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <Link to="/" className="hover:text-amber-500 transition-colors">
            <span className="text-amber-500 font-bold">CORPORATE</span> PRANKS
          </Link>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-stone-300 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-stone-300 transition-colors">Privacy</Link>
            <Link to="/support" className="hover:text-stone-300 transition-colors">Support</Link>
          </div>
          <p>&copy; 2025 Corporate Pranks</p>
        </div>
      </footer>

      {/* ═══ K. Mobile Sticky Bottom Bar ═══ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-stone-950/95 backdrop-blur-md border-t border-stone-800 px-4 py-3 transition-all duration-300 ${
          showStickyBar
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <span className="text-xl font-black text-white">$19.99</span>
            <span className="text-sm text-stone-500 line-through ml-2">$29.99</span>
          </div>
          <GlowButton onClick={() => handleCheckout()} className="flex-1" size="md">
            SEND THE MESSAGE
          </GlowButton>
        </div>
      </div>
    </div>
  );
}

// ─── Social Proof Bar ───────────────────────────────────────────────────────────

function SocialProofBar() {
  const { ref, isInView } = useInView(0.3);
  const packsSent = useAnimatedCounter(2847, 2000, isInView);
  const rating = useAnimatedCounter(49, 1500, isInView);
  const wouldSend = useAnimatedCounter(98, 1800, isInView);

  return (
    <section ref={ref} className="bg-gradient-to-r from-amber-600 to-orange-500 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center text-white">
        <div>
          <div className="text-3xl sm:text-4xl font-black">{packsSent.toLocaleString()}+</div>
          <div className="text-sm text-amber-100 mt-1 font-medium">Packs Shipped</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-black">{(rating / 10).toFixed(1)}</div>
          <div className="text-sm text-amber-100 mt-1 font-medium">Star Rating</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-black">{wouldSend}%</div>
          <div className="text-sm text-amber-100 mt-1 font-medium">Would Send Again</div>
        </div>
      </div>
    </section>
  );
}
