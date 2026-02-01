import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Scroll,
  Crown,
  Flame,
  BookOpen,
  ArrowRight,
  Mail,
  Instagram,
  Columns,
  Heart,
  ShoppingBag,
  Headphones,
  Coffee,
  ExternalLink,
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

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thanks for subscribing! The Senate will be in touch.");
    setEmail("");
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
        {/* Hero Section - Animated */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-stone-200 dark:border-stone-800">
          {/* Animated background elements */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
              transition: "transform 0.3s ease-out",
            }}
          >
            <div className="absolute top-20 left-[10%] text-8xl opacity-5 animate-float-slow">🏛️</div>
            <div className="absolute top-40 right-[15%] text-6xl opacity-5 animate-float-slow" style={{ animationDelay: "-2s" }}>⚔️</div>
            <div className="absolute bottom-32 left-[20%] text-7xl opacity-5 animate-float-slow" style={{ animationDelay: "-4s" }}>🦅</div>
            <div className="absolute bottom-20 right-[10%] text-5xl opacity-5 animate-float-slow" style={{ animationDelay: "-1s" }}>🏺</div>
          </div>

          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
            <div className="max-w-5xl mx-auto text-center">
              {/* Animated masthead */}
              <FadeUp delay={0}>
                <div className="flex items-center justify-center gap-3 mb-8">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600" />
                  <span className="text-amber-600 font-medium tracking-[0.4em] text-xs uppercase">
                    Est. MMXXIII
                  </span>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600" />
                </div>
              </FadeUp>

              {/* Main headline with character animation */}
              <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl mb-6 tracking-tight">
                <AnimatedText
                  text="THE CORPORATE"
                  className="text-stone-900 dark:text-stone-100 block whitespace-nowrap"
                  delay={0.2}
                />
                <span className="relative inline-block mt-2">
                  <WaveText
                    text="CHRONICLE"
                    className="text-amber-600"
                    waveInterval={4000}
                  />
                  <DrawUnderline className="absolute -bottom-2 left-0" />
                </span>
              </h1>

              {/* Tagline with word animation */}
              <FadeUp delay={1.2}>
                <p className="text-lg sm:text-xl md:text-2xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-4 font-serif italic px-2 sm:px-0">
                  <AnimatedWords
                    text="History doesn't repeat itself, but corporate America sure does."
                    delay={1.4}
                  />
                </p>
              </FadeUp>

              {/* Feature badges with stagger */}
              <FadeUp delay={1.8}>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-8 text-xs sm:text-sm text-stone-500 dark:text-stone-500 mb-10 px-2 sm:px-0">
                  {[
                    { icon: Columns, text: "Satire Since Rome" },
                    { icon: Scroll, text: "Ancient Parallels" },
                    { icon: Crown, text: "The Real Joke is the Job" },
                  ].map((item, i) => (
                    <span
                      key={item.text}
                      className="flex items-center gap-1.5 sm:gap-2 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                      style={{ animationDelay: `${2 + i * 0.15}s` }}
                    >
                      <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {item.text}
                    </span>
                  ))}
                </div>
              </FadeUp>

                          </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400">
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-stone-400 to-transparent animate-pulse" />
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

        {/* Featured Chronicle + Sidebar Layout */}
        <section className="py-16 border-b border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4">
            <FadeUp>
              <div className="flex items-center gap-3 mb-8">
                <Flame className="h-6 w-6 text-amber-600" />
                <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100">The Chronicles</h2>
              </div>
            </FadeUp>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Featured Story */}
              <FadeUp className="lg:col-span-2">
                <Link
                  to="/chronicle/the-performance-review"
                  className="group block bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 dark:border-stone-800 transform hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src="https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=500&fit=crop"
                      alt="The Performance Review"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-6 lg:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full uppercase tracking-wider">
                        Featured Chronicle
                      </span>
                      <span className="text-stone-500 text-sm">January 30, 2026</span>
                    </div>
                    <h3 className="font-display text-2xl lg:text-3xl mb-4 text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                      The Performance Review
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-3 font-serif">
                      Marcus had survived twelve quarters. In the arena, they called him Marcellus the Adequate — not because he was merely adequate, but because adequacy was the highest praise the Senate would allow...
                    </p>
                    <span className="inline-flex items-center gap-2 text-amber-600 font-medium group-hover:gap-3 transition-all">
                      Continue Reading <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </FadeUp>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Fund the Resistance */}
                <FadeUp delay={0.1}>
                  <div className="bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-900 rounded-lg p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20c0-1.1-.9-2-2-2s-2 .9-2 2 .9 2 2 2 2-.9 2-2zM0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <Heart className="h-5 w-5 text-red-400" />
                        <h3 className="font-display text-lg">Fund the Resistance</h3>
                      </div>
                      <p className="text-amber-400 text-sm font-medium mb-2">
                        This is what keeps us pranking.
                      </p>
                      <p className="text-stone-300 text-sm mb-4">
                        The Senate has unlimited resources. We have... you. Every denarius helps us survive another quarter.
                      </p>
                      <Link to="/support">
                        <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2">
                          <Heart className="h-4 w-4" />
                          Support the Chronicle
                        </Button>
                      </Link>
                    </div>
                  </div>
                </FadeUp>

                {/* The Armory */}
                <FadeUp delay={0.2}>
                  <div className="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 relative">
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-red-800 rotate-12">
                      S.A.
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingBag className="h-5 w-5 text-amber-600" />
                      <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">The Armory</h3>
                    </div>
                    <div className="space-y-3">
                      <Link to="/armory" className="flex items-center gap-3 group">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center text-2xl">🎭</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors text-sm">
                            Gladiator Survival Kit
                          </p>
                          <p className="text-amber-600 font-bold text-sm">$25</p>
                        </div>
                      </Link>
                      <Link to="/armory" className="flex items-center gap-3 group">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                          <div className="w-full h-full flex items-center justify-center text-2xl">📜</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors text-sm">
                            Senate Insider Guide
                          </p>
                          <p className="text-amber-600 font-bold text-sm">$15</p>
                        </div>
                      </Link>
                    </div>
                    <Link to="/armory">
                      <Button variant="outline" className="w-full mt-4 border-stone-300 dark:border-stone-700 text-amber-600">
                        Browse the Armory
                      </Button>
                    </Link>
                  </div>
                </FadeUp>

                {/* Imperial Marketplace */}
                <FadeUp delay={0.3}>
                  <div className="bg-gradient-to-br from-amber-50 to-stone-100 dark:from-amber-950/30 dark:to-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                    <div className="relative">
                      <p className="text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">The Imperial Marketplace</p>
                      <p className="text-stone-600 dark:text-stone-400 text-xs italic mb-4">Goods the Empire would prefer you not have.</p>
                      <div className="space-y-2">
                        <a href="#" className="flex items-center gap-3 group p-2 -mx-2 rounded-lg hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Headphones className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">Block Out the Synergy</p>
                            <p className="text-xs text-stone-500">Noise-canceling salvation</p>
                          </div>
                          <ExternalLink className="h-3 w-3 text-stone-400" />
                        </a>
                        <a href="#" className="flex items-center gap-3 group p-2 -mx-2 rounded-lg hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Coffee className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">Gladiator Fuel</p>
                            <p className="text-xs text-stone-500">Survive another arena day</p>
                          </div>
                          <ExternalLink className="h-3 w-3 text-stone-400" />
                        </a>
                        <a href="#" className="flex items-center gap-3 group p-2 -mx-2 rounded-lg hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <BookOpen className="h-4 w-4 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">Forbidden Readings</p>
                            <p className="text-xs text-stone-500">What the Senate banned</p>
                          </div>
                          <ExternalLink className="h-3 w-3 text-stone-400" />
                        </a>
                      </div>
                      <p className="text-xs text-stone-400 mt-4 text-center">Amazon affiliate links</p>
                    </div>
                  </div>
                </FadeUp>

                {/* Imperial Forum */}
                <FadeUp delay={0.4}>
                  <div className="bg-stone-100 dark:bg-stone-800/50 rounded-lg p-6 border border-dashed border-stone-300 dark:border-stone-700 text-center">
                    <p className="text-stone-500 text-xs uppercase tracking-wider mb-3 font-medium">The Imperial Forum</p>
                    <p className="text-stone-600 dark:text-stone-400 text-sm italic mb-3">
                      Ambitious merchants may petition for space here.
                    </p>
                    <a href="mailto:Info@corporatepranks.com" className="text-amber-600 hover:underline text-sm font-medium">
                      Request an Audience
                    </a>
                  </div>
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* More Chronicles Grid */}
        <section className="py-16 border-b border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4">
            <FadeUp>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                  <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">More Chronicles</h2>
                </div>
                <Link to="/chronicles" className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </FadeUp>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "The All-Hands Meeting",
                  date: "January 31, 2026",
                  href: "/chronicle/the-all-hands-meeting",
                  excerpt: "The horn sounded at the third hour. Attendance was mandatory. Enthusiasm was expected...",
                  image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&h=500&fit=crop",
                },
                {
                  title: "The Return to Office",
                  date: "February 1, 2026",
                  href: "/chronicle/the-return-to-office",
                  excerpt: "The Forum was remodeled, the banners were hung, and the Senate declared the return mandatory...",
                  image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=500&fit=crop",
                },
              ].map((chronicle, i) => (
                <FadeUp key={chronicle.title} delay={i * 0.1}>
                  <Link
                    to={chronicle.href}
                    className="group flex bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-stone-200 dark:border-stone-800"
                  >
                    <div className="w-32 md:w-40 flex-shrink-0 overflow-hidden relative">
                      <img
                        src={chronicle.image}
                        alt={chronicle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <p className="text-stone-500 text-xs mb-1">{chronicle.date}</p>
                      <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors mb-2">
                        {chronicle.title}
                      </h3>
                      <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-2 font-serif">
                        {chronicle.excerpt}
                      </p>
                    </div>
                  </Link>
                </FadeUp>
              ))}
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
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="py-24 bg-gradient-to-b from-amber-50 to-stone-100 dark:from-amber-950/20 dark:to-stone-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-2xl mx-auto text-center">
              <FadeUp>
                <div className="relative inline-block mb-8">
                  <Mail className="h-16 w-16 text-amber-600" />
                  <div className="absolute inset-0 bg-amber-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                </div>
              </FadeUp>

              <FadeUp delay={0.1}>
                <h2 className="font-display text-3xl sm:text-5xl md:text-6xl mb-6 text-stone-900 dark:text-stone-100">
                  Join the <span className="text-amber-600">Senate</span>
                </h2>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p className="text-stone-600 dark:text-stone-400 mb-10 text-lg md:text-xl max-w-xl mx-auto">
                  Get the full story delivered to your inbox. New chronicles, exclusive content, and first access to the mischief.
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
                    className="bg-amber-600 hover:bg-amber-700 text-white px-8 h-12 text-base group"
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </FadeUp>

              <FadeUp delay={0.4}>
                <p className="text-stone-500 text-sm mt-6">
                  No spam. Just satire. Unsubscribe anytime.
                </p>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* Instagram CTA */}
        <section className="py-20">
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
        </section>
      </main>

      <Footer />
    </div>
  );
}
