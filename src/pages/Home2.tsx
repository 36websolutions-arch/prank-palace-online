import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  Mail,
  Instagram,
  ShoppingBag,
} from "lucide-react";

// Hook for scroll-triggered animations
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Animated text component - splits text into characters
function AnimatedText({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.03
}: {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}) {
  const { ref, isInView } = useInView(0.2);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-500"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(20px)",
            transitionDelay: `${delay + i * staggerDelay}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// Wave text component - periodic wave animation through letters
function WaveText({
  text,
  className = "",
  waveInterval = 4000,
}: {
  text: string;
  className?: string;
  waveInterval?: number;
}) {
  const [waveKey, setWaveKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveKey((k) => k + 1);
    }, waveInterval);
    return () => clearInterval(interval);
  }, [waveInterval]);

  return (
    <span className={`inline-block ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={`${i}-${waveKey}`}
          className="inline-block animate-wave-letter"
          style={{
            animationDelay: `${i * 0.05}s`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

// Animated word component - splits text into words
function AnimatedWords({
  text,
  className = "",
  delay = 0
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView(0.2);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className="inline-block mr-[0.25em] transition-all duration-700"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(30px)",
            transitionDelay: `${delay + i * 0.08}s`,
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

// Fade up component for sections
function FadeUp({
  children,
  className = "",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
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

// Underline draw animation
function DrawUnderline({ className = "" }: { className?: string }) {
  const { ref, isInView } = useInView(0.5);

  return (
    <div
      ref={ref}
      className={`h-1 bg-amber-600 transition-all duration-1000 ease-out ${className}`}
      style={{
        width: isInView ? "100%" : "0%",
      }}
    />
  );
}

export default function Home2() {
  usePageMeta({
    title: "CorporatePranks",
    description: "Satire since Rome. Dispatches from the Corporate Empire. Chronicles, cologne that insults you, and mints for the socially unaware.",
    image: "/products/you-smell-like-shit/hero-1.webp",
    url: "/",
  });

  const [email, setEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const [subscribing, setSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || subscribing) return;
    setSubscribing(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email: email.trim() });
      if (error && error.code === "23505") {
        alert("You're already subscribed! The Senate appreciates your loyalty.");
      } else if (error) {
        throw error;
      } else {
        alert("Thanks for subscribing! The Senate will be in touch.");
      }
      setEmail("");
    } catch (err) {
      console.error("Newsletter signup error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 overflow-hidden">
      <Navbar />

      {/* Add custom styles for animations */}
      <style>{`
        @keyframes wave-letter {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-8px); }
          75% { transform: translateY(2px); }
        }
        .animate-wave-letter {
          animation: wave-letter 0.6s ease-in-out;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-out infinite;
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        @keyframes typewriter {
          from { width: 0; }
          to { width: 100%; }
        }
        .animate-typewriter {
          overflow: hidden;
          white-space: nowrap;
          animation: typewriter 2s steps(40) forwards;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-8px); }
          75% { transform: translateY(4px); }
        }
      `}</style>

      <main className="flex-1">
        {/* Hero Section - Featured Product */}
        <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-stone-900">
          {/* Animated background elements */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <div className="absolute top-20 left-[10%] text-8xl opacity-[0.03] animate-float-slow">🏛️</div>
            <div className="absolute bottom-20 right-[10%] text-6xl opacity-[0.03] animate-float-slow" style={{ animationDelay: "-2s" }}>⚔️</div>
          </div>

          {/* Subtle glow */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500 rounded-full filter blur-[200px]" />
          </div>

          <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto">
              {/* Left: Copy */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <FadeUp delay={0}>
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600" />
                    <span className="text-amber-500 font-medium tracking-[0.3em] text-xs uppercase">
                      The Armory's Finest
                    </span>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600" />
                  </div>
                </FadeUp>

                <FadeUp delay={0.15}>
                  <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 tracking-tight text-white leading-[0.95]">
                    You Smell
                    <br />
                    Like <span className="text-amber-500">Shit</span>
                  </h1>
                </FadeUp>

                <FadeUp delay={0.3}>
                  <p className="text-stone-400 text-lg sm:text-xl mb-3 font-serif italic max-w-md mx-auto lg:mx-0">
                    The gift that says what you're too polite to.
                  </p>
                  <p className="text-stone-500 text-sm mb-8 max-w-md mx-auto lg:mx-0">
                    Premium solid cologne disguised as brutal honesty. Hand it to a friend, a coworker, or that one guy in the elevator.
                  </p>
                </FadeUp>

                <FadeUp delay={0.45}>
                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <Link to="/you-smell-like-shit">
                      <Button className="bg-amber-600 hover:bg-amber-700 text-white px-10 h-14 text-lg font-semibold gap-2 group">
                        Send the Message — $19.99
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/armory" className="text-stone-400 hover:text-amber-500 text-sm font-medium flex items-center gap-1.5 transition-colors">
                      Browse The Armory <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </FadeUp>
              </div>

              {/* Right: Product Image */}
              <FadeUp delay={0.2} className="order-1 lg:order-2">
                <Link to="/you-smell-like-shit" className="block group">
                  <div className="relative max-w-md mx-auto">
                    <div className="aspect-square rounded-2xl overflow-hidden border border-stone-700/50 shadow-2xl shadow-amber-500/10 group-hover:shadow-amber-500/20 transition-shadow duration-500">
                      <img
                        src="/products/you-smell-like-shit/hero-1.webp"
                        alt="You Smell Like Shit - Premium Solid Cologne"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    {/* Price badge */}
                    <div className="absolute -bottom-3 -right-3 bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg">
                      $19.99
                    </div>
                  </div>
                </Link>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Stats Section - Social Proof */}
        <section className="py-12 sm:py-16 bg-amber-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-gradient" />
          <div className="container mx-auto px-4 relative">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 text-center">
              {[
                { number: "18,000+", label: "Citizens of the Empire", icon: "🏛️" },
                { number: "1,000+", label: "New Recruits Weekly", icon: "⚔️" },
                { number: "Daily", label: "Dispatches from the Arena", icon: "📜" },
              ].map((stat, i) => (
                <FadeUp key={stat.label} delay={i * 0.2}>
                  <div className="group cursor-default">
                    <div className="text-2xl sm:text-4xl mb-1 sm:mb-2 group-hover:scale-125 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-xl sm:text-4xl md:text-5xl font-bold mb-1 sm:mb-2 font-display">
                      {stat.number}
                    </div>
                    <div className="text-amber-100/80 text-[10px] sm:text-sm uppercase tracking-wider leading-tight">
                      {stat.label}
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* The Armory - Featured Products */}
        <section className="py-16 sm:py-20 bg-stone-900 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500 rounded-full filter blur-[200px]" />
          </div>

          <div className="container mx-auto px-4 relative">
            <FadeUp>
              <div className="text-center mb-10 sm:mb-14">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-600" />
                  <ShoppingBag className="h-5 w-5 text-amber-500" />
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-600" />
                </div>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white mb-3">
                  The <span className="text-amber-500">Armory</span>
                </h2>
                <p className="text-stone-400 text-sm sm:text-base max-w-lg mx-auto">
                  Weapons of mass communication. Say what you really think.
                </p>
              </div>
            </FadeUp>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  name: "You Smell Like Shit",
                  price: "$19.99",
                  tagline: "Solid cologne for someone who needs it",
                  image: "/products/you-smell-like-shit/hero-1.webp",
                  link: "/you-smell-like-shit",
                  cta: "Send the Message",
                },
                {
                  name: "Your Breath Stinks",
                  price: "$19.99",
                  tagline: "Sour mints for the socially unaware",
                  image: "/products/your-breath-stinks/hero-1.webp",
                  link: "/your-breath-stinks",
                  cta: "Send the Message",
                },
                {
                  name: "The DickHead",
                  price: "$250",
                  tagline: "The ultimate corporate statement piece",
                  image: "/products/the-dickhead/hero-1.webp",
                  link: "/the-dickhead",
                  cta: "Order Now",
                },
              ].map((product, i) => (
                <FadeUp key={product.name} delay={i * 0.15}>
                  <Link
                    to={product.link}
                    className="group block bg-stone-800/60 backdrop-blur rounded-xl overflow-hidden border border-stone-700/50 hover:border-amber-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                  >
                    <div className="aspect-square overflow-hidden bg-stone-800">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-lg text-white group-hover:text-amber-400 transition-colors mb-1">
                        {product.name}
                      </h3>
                      <p className="text-stone-400 text-sm mb-3">{product.tagline}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-amber-500 font-bold text-lg">{product.price}</span>
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500 group-hover:gap-2.5 transition-all">
                          {product.cta} <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </FadeUp>
              ))}
            </div>

            <FadeUp delay={0.5}>
              <div className="text-center mt-10">
                <Link to="/armory">
                  <Button variant="outline" className="border-amber-600/50 text-amber-500 hover:bg-amber-600 hover:text-white px-8 h-12 text-base gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Browse The Full Armory
                  </Button>
                </Link>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* Newsletter Section — Monthly Chronicle */}
        <section id="newsletter" className="py-20 bg-gradient-to-b from-amber-50 to-stone-100 dark:from-amber-950/20 dark:to-stone-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-2xl mx-auto text-center">
              <FadeUp>
                <div className="relative inline-block mb-6">
                  <Mail className="h-12 w-12 text-amber-600" />
                  <div className="absolute inset-0 bg-amber-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4 text-stone-900 dark:text-stone-100">
                  The Monthly <span className="text-amber-600">Dispatch</span>
                </h2>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p className="text-stone-600 dark:text-stone-400 mb-8 text-base sm:text-lg max-w-xl mx-auto">
                  Chronicles, new products, and dispatches from the Corporate Empire — delivered monthly.
                </p>
              </FadeUp>

              <FadeUp delay={0.3}>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="citizen@empire.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 h-12 text-base"
                  />
                  <Button
                    type="submit"
                    disabled={subscribing}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 h-12 text-base group"
                  >
                    {subscribing ? "Subscribing..." : "Subscribe"}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </FadeUp>

              <FadeUp delay={0.4}>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <p className="text-stone-500 text-sm">
                    No spam. Just satire. Unsubscribe anytime.
                  </p>
                  <Link to="/chronicles" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                    Read the Chronicles <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Testimonials / What Citizens Are Saying */}
        <section className="py-16 bg-stone-100 dark:bg-stone-900/50">
          <div className="container mx-auto px-4">
            <FadeUp>
              <div className="text-center mb-8 sm:mb-12 px-2 sm:px-0">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-stone-900 dark:text-stone-100 mb-4">
                  What Citizens Are Saying
                </h2>
                <p className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-sm sm:text-base">
                  Dispatches from the arena floor
                </p>
              </div>
            </FadeUp>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  quote: "Finally, someone who understands that my 'quick sync' is never quick and rarely synced.",
                  author: "Anonymous Gladiator",
                  role: "Senior Arena Performer",
                },
                {
                  quote: "I sent The Performance Review to my entire team. HR was not amused. Worth it.",
                  author: "Rebellious Centurion",
                  role: "Middle Management",
                },
                {
                  quote: "This is the only content that makes Monday mornings bearable. The Senate must be stopped.",
                  author: "Cubicle Warrior",
                  role: "Perpetual IC",
                },
              ].map((testimonial, i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-sm border border-stone-200 dark:border-stone-700 h-full flex flex-col">
                    <div className="text-4xl text-amber-500/30 font-serif mb-2">"</div>
                    <p className="text-stone-700 dark:text-stone-300 font-serif italic flex-1 mb-4">
                      {testimonial.quote}
                    </p>
                    <div className="border-t border-stone-200 dark:border-stone-700 pt-4">
                      <p className="font-medium text-stone-900 dark:text-stone-100 text-sm">
                        {testimonial.author}
                      </p>
                      <p className="text-stone-500 text-xs">{testimonial.role}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* The Roman Parallel Section */}
        <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full filter blur-[128px] animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] animate-pulse" style={{ animationDelay: "-1s" }} />
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto">
              <FadeUp>
                <blockquote className="text-center mb-16 px-2 sm:px-0">
                  <div className="text-4xl sm:text-6xl text-amber-500/30 font-serif mb-4">"</div>
                  <p className="font-serif text-xl sm:text-3xl md:text-4xl lg:text-5xl italic text-stone-200 leading-relaxed">
                    <AnimatedWords
                      text="In Rome, they had bread and circuses. Today, we have pizza parties and mandatory fun."
                    />
                  </p>
                  <footer className="mt-6 text-amber-500 font-medium text-sm sm:text-base">
                    — The Corporate Chronicle
                  </footer>
                </blockquote>
              </FadeUp>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { emoji: "🏛️", title: "The Senate = The Board", desc: "Roman senators served themselves while claiming to serve the people." },
                  { emoji: "🎭", title: "Gladiators = Employees", desc: "Fighting for survival in the arena, entertaining the masses." },
                  { emoji: "🔥", title: "The Fall = The Layoff", desc: "Every empire thinks it will last forever." },
                ].map((item, i) => (
                  <FadeUp key={item.title} delay={0.3 + i * 0.15}>
                    <div className="bg-stone-800/50 backdrop-blur rounded-xl p-6 border border-stone-700/50 hover:border-amber-500/30 transition-colors group">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {item.emoji}
                      </div>
                      <h3 className="font-display text-xl text-amber-400 mb-2">{item.title}</h3>
                      <p className="text-stone-400 text-sm">{item.desc}</p>
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section >

        {/* Instagram CTA */}
        < section className="py-20" >
          <div className="container mx-auto px-4">
            <FadeUp>
              <div className="max-w-4xl mx-auto">
                <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 text-white text-center overflow-hidden group">
                  {/* Animated background shimmer */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-gradient" />

                  <div className="relative">
                    <Instagram className="h-12 w-12 sm:h-20 sm:w-20 mx-auto mb-6 sm:mb-8 opacity-90 group-hover:rotate-12 transition-transform duration-500" />
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl mb-4 sm:mb-6">
                      The Daily Dispatch
                    </h2>
                    <p className="text-white/90 mb-6 sm:mb-8 text-base sm:text-lg max-w-xl mx-auto px-2 sm:px-0">
                      New stories drop daily. Follow for the first half of each chronicle, then come back here for the full story.
                    </p>
                    <a
                      href="https://www.instagram.com/corporatepranks"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button
                        size="lg"
                        className="bg-white text-purple-600 hover:bg-white/90 gap-2 px-10 h-14 text-lg font-semibold group/btn"
                      >
                        <Instagram className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                        @corporatepranks
                      </Button>
                    </a>
                    <p className="text-white/70 text-sm mt-6">
                      18,000+ citizens and counting
                    </p>
                  </div>
                </div>
              </div>
            </FadeUp>
          </div>
        </section >
      </main >

      <Footer />
    </div >
  );
}
