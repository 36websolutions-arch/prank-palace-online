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

type FlavorVariant = "sour-raspberry" | "toxic-tangerine" | "atomic-citrus" | "savage-apple" | "mango-meltdown";

interface FlavorInfo {
  id: FlavorVariant;
  name: string;
  description: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const FLAVOR_VARIANTS: FlavorInfo[] = [
  { id: "sour-raspberry", name: "Sour Raspberry Roast", description: "Tart raspberry with a citrus bite" },
  { id: "toxic-tangerine", name: "Toxic Tangerine", description: "Tangerine blast that'll wake the dead" },
  { id: "atomic-citrus", name: "Atomic Citrus", description: "Lemon-lime nuclear fusion" },
  { id: "savage-apple", name: "Savage Apple", description: "Green apple with a sour punch" },
  { id: "mango-meltdown", name: "Mango Meltdown", description: "Tropical mango gone nuclear" },
];

const CARD_OPTIONS: CardOption[] = [
  { id: 1, name: "The Intervention", front: "We Need to Talk.", inside: "It's about your breath. The group chat voted. It was unanimous. Here are some mints." },
  { id: 2, name: "The Dentist's Note", front: "URGENT DENTAL NOTICE", inside: "Patient: You. Diagnosis: Weapons-grade halitosis. Treatment: Take these mints immediately. This is not optional." },
  { id: 3, name: "The Breakup Letter", front: "I Can't Get Close Anymore.", inside: "Every time you talk, a small part of me dies. Please. Take these mints. Save what's left of us." },
  { id: 4, name: "The HR Complaint", front: "FORMAL COMPLAINT", inside: "Re: Biological hazard emanating from your mouth. Enclosed: Emergency corrective supplies. Compliance is mandatory." },
  { id: 5, name: "The Obituary", front: "In Loving Memory", inside: "Of fresh air, which died every time you opened your mouth. These mints are a resurrection attempt." },
  { id: 6, name: "The Restraining Order", front: "CEASE AND DESIST", inside: "You are hereby ordered to maintain a 6-foot radius when speaking. Alternatively, consume the enclosed mints." },
  { id: 7, name: "The Recall Notice", front: "PRODUCT RECALL: Your Breath", inside: "Manufacturer defect detected. Return to dentist immediately. In the meantime, please apply these mints generously." },
  { id: 8, name: "The Amber Alert", front: "MISSING: Your Oral Hygiene", inside: "Last seen: Unknown. If found, please return immediately. Until then, these mints will have to do." },
  { id: 9, name: "The Yelp Review", front: "★☆☆☆☆ Would Not Recommend", inside: "Sat next to this person at lunch. Worst experience of my life. Sending mints as reparations." },
  { id: 10, name: "The Insurance Claim", front: "CLAIM #BR-34TH", inside: "Incident: Exposed to hazardous oral emissions. Seeking damages. Settlement enclosed in mint form." },
  { id: 11, name: "The Eviction Notice", front: "NOTICE TO VACATE", inside: "Your breath has been asked to leave the premises. These mints are its replacement tenants." },
  { id: 12, name: "The Science Report", front: "FINDINGS: Conclusive", inside: "After extensive peer-reviewed research, your breath is, in fact, terrible. Remedy: Enclosed sour mints. Apply liberally." },
  { id: 13, name: "The Confession", front: "I Have a Secret", inside: "I've been holding my breath around you for 3 years. Please take these mints so I can breathe again." },
  { id: 14, name: "The Love Letter (Almost)", front: "Dear [Name],", inside: "I could fall in love with you... if you'd stop exhaling. Here are some mints. Let's try this again." },
  { id: 15, name: "The Exit Interview", front: "Reason for Departure:", inside: "The breath. It was always the breath. Please accept these mints as our parting gift." },
  { id: 16, name: "The Mint Prescription", front: "Rx: TAKE IMMEDIATELY", inside: "Dosage: Every mint in this tin. Refills: Unlimited. Side effects: People will want to be near you again." },
  { id: 17, name: "Custom Message", front: "", inside: "" },
];

const REVIEWS = [
  { stars: 5, text: "Bought this for my cubicle neighbor. They laughed, then actually ate the mints. Win-win.", author: "Jake M." },
  { stars: 5, text: "My boyfriend's breath could strip paint. He got the hint. These mints are doing God's work.", author: "Rachel T." },
  { stars: 5, text: "The 'Dentist's Note' card made my sister cry laughing. Then she booked a dental appointment. Mission accomplished.", author: "Marcus D." },
  { stars: 5, text: "I've been waiting for Altoids Sours to come back for 15 YEARS. The fact that I can weaponize them as a prank? *chef's kiss*", author: "Ashley R." },
  { stars: 5, text: "Sent the Full Intervention pack to my roommate. He now brushes THREE times a day. The tins are actually fire too.", author: "Tyler K." },
  { stars: 5, text: "The 'Restraining Order' card was so realistic my dad almost called a lawyer. 10/10 would prank again.", author: "Sarah W." },
];

const FAQ_ITEMS = [
  {
    q: "Are these real Altoids Sours?",
    a: "These are premium sour mints inspired by the legendary discontinued Altoids Sours. Same round tin energy, same sour punch, but with flavors that actually slap harder."
  },
  {
    q: "Will these actually fix bad breath?",
    a: "Temporarily, yes. Permanently? That's between them and their dentist. We just deliver the message."
  },
  {
    q: "What flavors are available?",
    a: "Five flavors: Sour Raspberry Roast (tart raspberry), Toxic Tangerine (citrus blast), Atomic Citrus (lemon-lime), Savage Apple (green apple sour), and Mango Meltdown (tropical nuclear). Each tin is packed to the brim."
  },
  {
    q: "Is the card included?",
    a: "Every order comes with one savage card of your choice (or write your own). It's not a gift without the roast."
  },
  {
    q: "Can I send this anonymously?",
    a: "Absolutely. Cowardice is encouraged. We ship with no return address. They'll never know who did it (unless your card gives it away)."
  },
  {
    q: "What if they get offended?",
    a: "Then their breath probably really does stink. You did them a favor. Plus they still get premium sour mints out of it."
  },
  {
    q: "How is this packaged?",
    a: "Discreet outer packaging, chaos inside. The mint tin is beautifully designed (round, colorful, collectible), the card is savage, and the whole thing screams 'I care about you but also your breath is terrible.'"
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
        bg-gradient-to-r from-emerald-500 to-teal-500
        text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]
        hover:shadow-[0_0_50px_rgba(16,185,129,0.6)]
        hover:scale-[1.03] active:scale-[0.98]
        transition-all duration-300
        animate-subtle-pulse-green
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function YourBreathStinks() {
  const navigate = useNavigate();

  // State
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorVariant>("sour-raspberry");
  const [selectedCard, setSelectedCard] = useState<number>(1);
  const [customFront, setCustomFront] = useState("");
  const [customInside, setCustomInside] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);
  const [heroImage, setHeroImage] = useState(0);
  const [viewingCount, setViewingCount] = useState(23);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [bundleQty, setBundleQty] = useState(1);
  const heroRef = useRef<HTMLDivElement>(null);

  const heroImages = [
    "/products/your-breath-stinks/hero-1.png",
    "/products/your-breath-stinks/hero-2.png",
    "/products/your-breath-stinks/hero-3.png",
  ];

  // Viewing counter randomizer
  useEffect(() => {
    const interval = setInterval(() => {
      setViewingCount(Math.floor(Math.random() * 25) + 12);
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

  // Save selections and go straight to checkout
  const handleCheckout = (overrideQty?: number) => {
    const qty = overrideQty ?? bundleQty;
    const card = CARD_OPTIONS.find(c => c.id === selectedCard);
    const flavor = FLAVOR_VARIANTS.find(f => f.id === selectedFlavor);

    localStorage.setItem("ybsOrder", JSON.stringify({
      productName: "Your Breath Stinks - Sour Mint Gift Set",
      flavorVariant: flavor?.name,
      flavorId: flavor?.id,
      cardId: selectedCard,
      cardName: card?.name,
      cardFront: selectedCard === 17 ? customFront : card?.front,
      cardInside: selectedCard === 17 ? customInside : card?.inside,
      bundleQty: qty,
      unitPrice: 19.99,
      totalPrice: getBundlePrice(qty),
      comparePrice: getComparePrice(qty),
      image: "/products/your-breath-stinks/hero-1.png",
    }));

    trackAddToCart("Your Breath Stinks - Sour Mint Gift Set", getBundlePrice(qty));
    navigate("/checkout?from=ybs");
  };

  const currentCard = CARD_OPTIONS.find(c => c.id === selectedCard)!;

  return (
    <div className="min-h-screen bg-stone-950 text-white overflow-x-hidden">
      <style>{`
        @keyframes subtle-pulse-green {
          0%, 100% { box-shadow: 0 0 30px rgba(16,185,129,0.4); }
          50% { box-shadow: 0 0 50px rgba(16,185,129,0.6); }
        }
        .animate-subtle-pulse-green {
          animation: subtle-pulse-green 2.5s ease-in-out infinite;
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
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>

      {/* ═══ A. Announcement Bar ═══ */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 text-sm font-bold tracking-wide px-4">
              <span>FREE SHIPPING ON 2+ PACKS</span>
              <span className="text-emerald-200">•</span>
              <span>INSPIRED BY THE LEGENDARY ALTOIDS SOURS</span>
              <span className="text-emerald-200">•</span>
              <span>THE PRANK GIFT THAT ACTUALLY TASTES AMAZING</span>
              <span className="text-emerald-200">•</span>
              <span>FREE SHIPPING ON 2+ PACKS</span>
              <span className="text-emerald-200">•</span>
              <span>INSPIRED BY THE LEGENDARY ALTOIDS SOURS</span>
              <span className="text-emerald-200">•</span>
              <span>THE PRANK GIFT THAT ACTUALLY TASTES AMAZING</span>
              <span className="text-emerald-200 mr-8">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ Minimal Header ═══ */}
      <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="text-emerald-500">CORPORATE</span>
            <span className="text-stone-400">PRANKS</span>
          </Link>
          <Link to="/cart" className="relative p-2 text-stone-400 hover:text-emerald-500 transition-colors">
            <ShoppingCart className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* ═══ B. Hero Section ═══ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center py-12 lg:py-20">
        {/* Ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px]" />
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
                    🍬
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
                      i === heroImage ? "bg-emerald-500 w-8" : "bg-stone-600 hover:bg-stone-500"
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
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-bold">
                <Star className="h-4 w-4 fill-emerald-400" />
                ALTOIDS SOURS ARE BACK (SORT OF)
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
                YOUR FRIEND'S BREATH{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  STINKS.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-stone-400 italic font-serif">
                The mints everyone begged to come back. Delivered to someone who needs them most.
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

              {/* Flavor Selector */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-stone-300 uppercase tracking-wider">Choose Your Flavor</label>
                <div className="flex flex-wrap gap-2">
                  {FLAVOR_VARIANTS.map(flavor => (
                    <button
                      key={flavor.id}
                      onClick={() => setSelectedFlavor(flavor.id)}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all border ${
                        selectedFlavor === flavor.id
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                          : "bg-stone-800/50 border-stone-700 text-stone-300 hover:border-stone-500"
                      }`}
                    >
                      <div className="font-bold">{flavor.name}</div>
                      <div className="text-xs opacity-70 mt-0.5">{flavor.description}</div>
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
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:border-emerald-500 focus:outline-none transition-colors"
                  >
                    {CARD_OPTIONS.map(card => (
                      <option key={card.id} value={card.id}>
                        {card.id === 17 ? "Custom Message — Write Your Own" : `${card.name} — "${card.front}"`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Custom message fields */}
              {selectedCard === 17 && (
                <div className="space-y-3 bg-stone-900/50 border border-stone-800 rounded-xl p-4">
                  <div>
                    <label className="text-xs font-bold text-stone-400 uppercase">Card Front</label>
                    <input
                      type="text"
                      placeholder="Write your front message..."
                      value={customFront}
                      onChange={(e) => setCustomFront(e.target.value)}
                      maxLength={60}
                      className="w-full mt-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none"
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
                      className="w-full mt-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none resize-none"
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
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" /> 4.9/5 Rating</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Real Sour Mints</span>
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
              HOW IT <span className="text-emerald-400">WORKS</span>
            </h2>
            <p className="text-stone-400 text-center text-lg mb-16 max-w-xl mx-auto">
              Three steps to saving everyone from their breath.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎯", title: "Pick Your Flavor", desc: "Choose from 5 sour mint flavors inspired by the legendary Altoids Sours. Then pick a savage card." },
              { icon: "📦", title: "We Ship It", desc: "Straight to your friend's door. Anonymously. No return address. Maximum confusion." },
              { icon: "😂", title: "They Open It", desc: "They read the card. They see the mints. They die laughing. Then they actually eat them because they're incredible." },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="text-center bg-stone-900/50 border border-stone-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-all duration-300">
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <div className="text-xs text-emerald-500 font-bold tracking-widest mb-3">STEP {i + 1}</div>
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
              PICK YOUR <span className="text-emerald-400">ROAST</span>
            </h2>
            <p className="text-stone-400 text-center text-lg mb-16">
              16 pre-written cards. Or write your own savage masterpiece.
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
                    className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 border-2 border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                      cardFlipped ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    <div className="text-xs text-emerald-500 font-bold tracking-widest mb-6">FRONT</div>
                    <p className="text-2xl sm:text-3xl font-bold italic leading-tight">
                      {selectedCard === 17
                        ? (customFront || "Your message here...")
                        : `"${currentCard.front}"`}
                    </p>
                    <div className="absolute bottom-6 text-xs text-stone-500">Tap to flip</div>
                  </div>

                  {/* Inside */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 border-2 border-emerald-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                      cardFlipped ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-95"
                    }`}
                  >
                    <div className="text-xs text-emerald-500 font-bold tracking-widest mb-6">INSIDE</div>
                    <p className="text-lg sm:text-xl text-stone-300 leading-relaxed italic">
                      {selectedCard === 17
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
                        ? "bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                        : "bg-stone-900/50 border-stone-800 hover:border-stone-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedCard === card.id ? "border-emerald-500 bg-emerald-500" : "border-stone-600"
                      }`}>
                        {selectedCard === card.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-white">
                          {card.id === 17 ? "Custom Message" : card.name}
                        </div>
                        {card.id !== 17 && (
                          <div className="text-xs text-stone-400 mt-1 truncate">
                            "{card.front}" → "{card.inside.slice(0, 50)}..."
                          </div>
                        )}
                        {card.id === 17 && (
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
              CHOOSE YOUR <span className="text-emerald-400">LEVEL</span>
            </h2>
            <p className="text-stone-400 text-center text-lg mb-16">
              More packs = more savings. Save the whole office.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                qty: 1, name: "The Casual Hint", desc: "1 mint tin + 1 savage card",
                price: 19.99, compare: 29.99, badge: null, popular: false,
              },
              {
                qty: 2, name: "The Double Down", desc: "2 tins (mix flavors!) + card + sticker sheet • FREE SHIPPING",
                price: 34.99, compare: 39.98, badge: "MOST POPULAR", popular: true,
              },
              {
                qty: 3, name: "The Full Intervention", desc: "All 5 flavors + card + Breath Citation + stickers • FREE SHIPPING",
                price: 49.99, compare: 59.97, badge: "BEST VALUE", popular: false,
              },
            ].map((tier, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className={`relative rounded-2xl border p-6 text-center transition-all duration-300 hover:scale-[1.02] ${
                  tier.popular
                    ? "bg-gradient-to-b from-emerald-500/10 to-stone-900 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                    : "bg-stone-900/50 border-stone-800 hover:border-stone-600"
                }`}>
                  {tier.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${
                      tier.popular ? "bg-emerald-500 text-stone-950" : "bg-stone-700 text-stone-200"
                    }`}>
                      {tier.badge}
                    </div>
                  )}

                  <div className="text-4xl mb-3">{tier.qty === 1 ? "🍬" : tier.qty === 2 ? "🔥" : "💣"}</div>
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <p className="text-sm text-stone-400 mb-4">{tier.desc}</p>

                  <div className="mb-6">
                    <span className="text-3xl font-black">${tier.price.toFixed(2)}</span>
                    <span className="text-stone-500 line-through ml-2">${tier.compare.toFixed(2)}</span>
                  </div>

                  <GlowButton
                    onClick={() => handleCheckout(tier.qty)}
                    className="w-full"
                    size="md"
                  >
                    {tier.qty === 1 ? "SEND THE HINT" : tier.qty === 2 ? "GET 2 PACKS" : "FULL INTERVENTION"}
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
              WHY THIS <span className="text-emerald-400">GIFT?</span>
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: "🍬", title: "Legendary Sour Mints", desc: "Inspired by the discontinued Altoids Sours that the internet spent 15 years mourning. These are the real deal." },
              { icon: "😂", title: "The Reaction Is Priceless", desc: "Worth every penny just for the look on their face when they read the card." },
              { icon: "💌", title: "Savage Card Included", desc: "16 pre-written roasts or write your own. Free with every pack." },
              { icon: "🕵️", title: "Anonymous Shipping", desc: "No return address. Maximum plausible deniability." },
            ].map((feature, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="flex gap-5 bg-stone-900/50 border border-stone-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300">
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
                WHAT PEOPLE <span className="text-emerald-400">SAY</span>
              </h2>
              <div className="flex items-center justify-center gap-2 text-lg">
                <StarRating />
                <span className="text-stone-400">4.9/5 from 1,247+ reviews</span>
              </div>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 hover:border-emerald-500/20 transition-all duration-300">
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
              STILL GOT <span className="text-emerald-400">QUESTIONS?</span>
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
                  <AccordionTrigger className="text-left font-bold text-white hover:text-emerald-400 hover:no-underline py-5">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeUp>
            <div className="text-7xl mb-8">🍬</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase mb-4 tracking-tight">
              STILL THINKING?
            </h2>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mb-3">
              THEIR BREATH STILL STINKS.
            </p>
            <p className="text-xl text-stone-400 italic font-serif mb-10">
              Do the right thing. The mints they've been waiting 15 years for.
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
          <Link to="/" className="hover:text-emerald-500 transition-colors">
            <span className="text-emerald-500 font-bold">CORPORATE</span> PRANKS
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
  const packsSent = useAnimatedCounter(1247, 2000, isInView);
  const rating = useAnimatedCounter(49, 1500, isInView);
  const wouldSend = useAnimatedCounter(97, 1800, isInView);

  return (
    <section ref={ref} className="bg-gradient-to-r from-emerald-600 to-teal-500 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center text-white">
        <div>
          <div className="text-3xl sm:text-4xl font-black">{packsSent.toLocaleString()}+</div>
          <div className="text-sm text-emerald-100 mt-1 font-medium">Packs Shipped</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-black">{(rating / 10).toFixed(1)}</div>
          <div className="text-sm text-emerald-100 mt-1 font-medium">Star Rating</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-black">{wouldSend}%</div>
          <div className="text-sm text-emerald-100 mt-1 font-medium">Would Send Again</div>
        </div>
      </div>
    </section>
  );
}
