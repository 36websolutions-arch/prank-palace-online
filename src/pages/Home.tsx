import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { supabase } from "@/integrations/supabase/client";
import {
  Scroll,
  Crown,
  Flame,
  BookOpen,
  ArrowRight,
  Mail,
  Heart,
  ShoppingBag,
  Instagram,
  Quote,
  Columns,
  Users,
  ExternalLink,
  Headphones,
  Coffee
} from "lucide-react";
import { format } from "date-fns";
import logo from "@/assets/logo.png";

interface Blog {
  id: string;
  title: string;
  image: string | null;
  published_at: string | null;
  content: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

export default function Home() {
  const [featuredStory, setFeaturedStory] = useState<Blog | null>(null);
  const [recentStories, setRecentStories] = useState<Blog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const fallbackChronicles = [
    {
      title: "The Performance Review",
      date: "January 30, 2026",
      href: "/chronicle/the-performance-review",
      excerpt:
        "Marcus had survived twelve quarters. In the arena, they called him Marcellus the Adequate — not because he was merely adequate, but because adequacy was the highest praise the Senate would allow.",
    },
    {
      title: "The All-Hands Meeting",
      date: "January 31, 2026",
      href: "/chronicle/the-all-hands-meeting",
      excerpt:
        "The horn sounded at the third hour. Attendance was mandatory. Enthusiasm was expected. Comprehension was optional.",
    },
    {
      title: "The Return to Office",
      date: "February 1, 2026",
      href: "/chronicle/the-return-to-office",
      excerpt:
        "The Forum was remodeled, the banners were hung, and the Senate declared the return mandatory.",
    },
  ];
  const additionalChronicles = fallbackChronicles.filter(
    (chronicle) =>
      chronicle.title !== featuredStory?.title &&
      !recentStories.some((story) => story.title === chronicle.title)
  );

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const [blogsRes, productsRes] = await Promise.all([
      supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(4),
      supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3)
    ]);

    if (blogsRes.data && blogsRes.data.length > 0) {
      setFeaturedStory(blogsRes.data[0]);
      setRecentStories(blogsRes.data.slice(1));
    }
    setProducts(productsRes.data || []);
    setLoading(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with email service
    alert("Thanks for subscribing! The Senate will be in touch.");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section - Editorial Style */}
        <section className="relative overflow-hidden border-b border-stone-200 dark:border-stone-800">
          {/* Texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 py-16 lg:py-24 relative">
            <div className="max-w-4xl mx-auto text-center">
              {/* Masthead */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-amber-600" />
                <span className="text-amber-600 font-medium tracking-[0.3em] text-xs uppercase">Est. MMXXIII</span>
                <div className="h-px w-12 bg-amber-600" />
              </div>

              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mb-4 tracking-tight text-stone-900 dark:text-stone-100">
                THE CORPORATE
                <span className="block text-amber-600">CHRONICLE</span>
              </h1>

              <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto mb-3 font-serif italic">
                "History doesn't repeat itself, but corporate America sure does."
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-stone-500 dark:text-stone-500 mb-8">
                <span className="flex items-center gap-2">
                  <Columns className="h-4 w-4" />
                  Satire Since Rome
                </span>
                <span className="flex items-center gap-2">
                  <Scroll className="h-4 w-4" />
                  Ancient Parallels
                </span>
                <span className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  The Real Joke is the Job
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://www.instagram.com/corporatepranks"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white border-0 px-8 animate-pulse-glow">
                    <Instagram className="h-5 w-5" />
                    Follow the Satire
                  </Button>
                </a>
                <Button
                  variant="outline"
                  className="gap-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-900"
                  onClick={() => document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Mail className="h-5 w-5" />
                  Join the Senate
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative columns */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden xl:block opacity-10 animate-float">
            <div className="text-6xl">🏛️</div>
          </div>
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 hidden xl:block opacity-10 animate-float"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="text-6xl">🏛️</div>
          </div>
        </section>

        {/* Follower Social Proof */}
        <section className="bg-amber-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="font-bold">18,000+</span> Citizens of the Empire
              </div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5" />
                <span className="font-bold">1,000+</span> New Recruits Weekly
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Daily Dispatches from the Cubicle Colosseum
              </div>
            </div>
          </div>
        </section>

        {/* Featured Story + Sidebar Layout */}
        <section className="py-16 border-b border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Flame className="h-6 w-6 text-amber-600" />
              <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100">The Chronicles</h2>
            </div>

            {loading ? (
              <ChronicleLoader />
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Featured Story */}
                <div className="lg:col-span-2">
                  {featuredStory ? (
                    <Link
                      to={`/blog/${featuredStory.id}`}
                      className="group block bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 dark:border-stone-800 transform hover:-translate-y-1"
                    >
                      {featuredStory.image ? (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={featuredStory.image}
                            alt={featuredStory.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-gradient-to-br from-amber-100 to-stone-200 dark:from-amber-900/20 dark:to-stone-800 flex items-center justify-center">
                          <Scroll className="h-20 w-20 text-amber-600/30" />
                        </div>
                      )}
                      <div className="p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full uppercase tracking-wider">
                            Featured Chronicle
                          </span>
                          {featuredStory.published_at && (
                            <span className="text-stone-500 text-sm">
                              {format(new Date(featuredStory.published_at), "MMMM d, yyyy")}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-2xl lg:text-3xl mb-4 text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                          {featuredStory.title}
                        </h3>
                        <p className="text-stone-600 dark:text-stone-400 mb-4 line-clamp-3 font-serif">
                          {featuredStory.content.substring(0, 250)}...
                        </p>
                        <span className="inline-flex items-center gap-2 text-amber-600 font-medium group-hover:gap-3 transition-all">
                          Continue Reading <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      to="/chronicle/the-performance-review"
                      className="group block bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-stone-200 dark:border-stone-800 transform hover:-translate-y-1"
                    >
                      <div className="aspect-[16/9] bg-gradient-to-br from-amber-100 to-stone-200 dark:from-amber-900/20 dark:to-stone-800 flex items-center justify-center">
                        <Scroll className="h-20 w-20 text-amber-600/30" />
                      </div>
                      <div className="p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full uppercase tracking-wider">
                            Featured Chronicle
                          </span>
                          <span className="text-stone-500 text-sm">
                            January 30, 2026
                          </span>
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
                  )}
                </div>

                {/* Sidebar - Monetization Zone */}
                <div className="space-y-6">
                  {/* Support the Satire - Donation CTA */}
                  <div className="bg-gradient-to-br from-stone-900 to-stone-800 dark:from-stone-800 dark:to-stone-900 rounded-lg p-6 text-white relative overflow-hidden">
                    {/* Parchment texture overlay */}
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
                      <div className="space-y-2">
                        <Link to="/support">
                          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2">
                            <Heart className="h-4 w-4" />
                            Support the Chronicle
                          </Button>
                        </Link>
                        <a href="https://ko-fi.com/corporatepranks" target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="w-full border-amber-500/40 text-amber-100 hover:text-amber-50 hover:border-amber-400">
                            Tip on Ko-fi
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Featured Products - Contextual */}
                  <div className="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 relative">
                    {/* Senate Approved Badge */}
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-red-800 rotate-12">
                      S.A.
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingBag className="h-5 w-5 text-amber-600" />
                      <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">The Armory</h3>
                    </div>

                    {products.length > 0 ? (
                      <div className="space-y-4">
                        {products.slice(0, 2).map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                              {product.image ? (
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl">🎭</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                                {product.name}
                              </p>
                              <p className="text-amber-600 font-bold">${product.price}</p>
                            </div>
                          </Link>
                        ))}
                        <Link to="/armory">
                          <Button variant="outline" className="w-full mt-2 border-stone-300 dark:border-stone-700">
                            Browse the Armory
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <p className="text-stone-500 text-sm">Arsenal loading...</p>
                    )}
                  </div>

                  {/* Imperial Marketplace - Affiliate Products */}
                  <div className="bg-gradient-to-br from-amber-50 to-stone-100 dark:from-amber-950/30 dark:to-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 relative overflow-hidden">
                    {/* Parchment texture */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                    <div className="relative">
                      <p className="text-xs text-stone-500 uppercase tracking-wider mb-2 font-medium">The Imperial Marketplace</p>
                      <p className="text-stone-600 dark:text-stone-400 text-xs italic mb-4">Goods the Empire would prefer you not have.</p>

                      <div className="space-y-3">
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 group p-2 -mx-2 rounded-lg hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Headphones className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                              Block Out the Synergy
                            </p>
                            <p className="text-xs text-stone-500">Noise-canceling salvation</p>
                          </div>
                          <ExternalLink className="h-3 w-3 text-stone-400" />
                        </a>

                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 group p-2 -mx-2 rounded-lg hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <Coffee className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                              Gladiator Fuel
                            </p>
                            <p className="text-xs text-stone-500">Survive another arena day</p>
                          </div>
                          <ExternalLink className="h-3 w-3 text-stone-400" />
                        </a>

                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 group p-2 -mx-2 rounded-lg hover:bg-white/50 dark:hover:bg-stone-800/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-amber-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                              Forbidden Readings
                            </p>
                            <p className="text-xs text-stone-500">What the Senate banned</p>
                          </div>
                          <ExternalLink className="h-3 w-3 text-stone-400" />
                        </a>
                      </div>

                      <p className="text-xs text-stone-400 mt-4 text-center">
                        Amazon affiliate links
                      </p>
                    </div>
                  </div>

                  {/* Ad Space Placeholder */}
                  <div className="bg-stone-100 dark:bg-stone-800/50 rounded-lg p-6 border border-dashed border-stone-300 dark:border-stone-700 text-center relative">
                    <p className="text-stone-500 text-xs uppercase tracking-wider mb-3 font-medium">The Imperial Forum</p>
                    <p className="text-stone-600 dark:text-stone-400 text-sm italic mb-3">
                      Ambitious merchants may petition for space here.
                    </p>
                    <a href="mailto:Info@corporatepranks.com" className="text-amber-600 hover:underline text-sm font-medium">
                      Request an Audience
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Recent Stories Grid */}
        <section className="py-16 border-b border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-amber-600" />
                <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100">More Chronicles</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentStories.map((story) => (
                <Link
                  key={story.id}
                  to={`/blog/${story.id}`}
                  className="group bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-stone-200 dark:border-stone-800 transform hover:-translate-y-1"
                >
                  {story.image ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-gradient-to-br from-amber-100 to-stone-200 dark:from-amber-900/20 dark:to-stone-800 flex items-center justify-center">
                      <Scroll className="h-12 w-12 text-amber-600/30" />
                    </div>
                  )}
                  <div className="p-5">
                    {story.published_at && (
                      <p className="text-stone-500 text-sm mb-2">
                        {format(new Date(story.published_at), "MMM d, yyyy")}
                      </p>
                    )}
                    <h3 className="font-display text-xl text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors mb-2">
                      {story.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-2 font-serif">
                      {story.content.substring(0, 120)}...
                    </p>
                  </div>
                </Link>
              ))}
              {additionalChronicles.map((chronicle) => (
                <Link
                  key={chronicle.href}
                  to={chronicle.href}
                  className="group bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-stone-200 dark:border-stone-800 transform hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] bg-gradient-to-br from-amber-100 to-stone-200 dark:from-amber-900/20 dark:to-stone-800 flex items-center justify-center">
                    <Scroll className="h-12 w-12 text-amber-600/30" />
                  </div>
                  <div className="p-5">
                    <p className="text-stone-500 text-sm mb-2">{chronicle.date}</p>
                    <h3 className="font-display text-xl text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors mb-2">
                      {chronicle.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-2 font-serif">
                      {chronicle.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
              {recentStories.length === 0 && additionalChronicles.length === 0 && (
                fallbackChronicles.map((chronicle) => (
                  <Link
                    key={chronicle.href}
                    to={chronicle.href}
                    className="group bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-stone-200 dark:border-stone-800 transform hover:-translate-y-1"
                  >
                    <div className="aspect-[16/10] bg-gradient-to-br from-amber-100 to-stone-200 dark:from-amber-900/20 dark:to-stone-800 flex items-center justify-center">
                      <Scroll className="h-12 w-12 text-amber-600/30" />
                    </div>
                    <div className="p-5">
                      <p className="text-stone-500 text-sm mb-2">{chronicle.date}</p>
                      <h3 className="font-display text-xl text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors mb-2">
                        {chronicle.title}
                      </h3>
                      <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-2 font-serif">
                        {chronicle.excerpt}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        {/* The Roman Parallel - Brand Explainer */}
        <section className="py-16 bg-stone-900 text-white relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 text-8xl">🏺</div>
            <div className="absolute bottom-10 right-10 text-8xl">⚔️</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl">🦅</div>
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Quote className="h-12 w-12 text-amber-500 mx-auto mb-6" />
              <blockquote className="font-serif text-2xl md:text-3xl italic mb-6 text-stone-200">
                "In Rome, they had bread and circuses to distract the masses. Today, we have pizza parties and mandatory fun."
              </blockquote>
              <p className="text-amber-500 font-medium mb-8">— The Corporate Chronicle</p>

              <div className="grid md:grid-cols-3 gap-8 mt-12 text-left">
                <div className="bg-stone-800/50 rounded-lg p-6 backdrop-blur">
                  <div className="text-3xl mb-3">🏛️</div>
                  <h3 className="font-display text-xl mb-2 text-amber-400">The Senate = The Board</h3>
                  <p className="text-stone-400 text-sm">
                    Roman senators served themselves while claiming to serve the people. Sound familiar?
                  </p>
                </div>
                <div className="bg-stone-800/50 rounded-lg p-6 backdrop-blur">
                  <div className="text-3xl mb-3">🎭</div>
                  <h3 className="font-display text-xl mb-2 text-amber-400">Gladiators = Employees</h3>
                  <p className="text-stone-400 text-sm">
                    Fighting for survival in the arena, entertaining the masses for the glory of the empire.
                  </p>
                </div>
                <div className="bg-stone-800/50 rounded-lg p-6 backdrop-blur">
                  <div className="text-3xl mb-3">🔥</div>
                  <h3 className="font-display text-xl mb-2 text-amber-400">The Fall = The Layoff</h3>
                  <p className="text-stone-400 text-sm">
                    Every empire thinks it will last forever. Every company thinks they're too big to fail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="py-20 bg-amber-50 dark:bg-amber-950/20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Mail className="h-12 w-12 text-amber-600 mx-auto mb-6" />
              <h2 className="font-display text-4xl mb-4 text-stone-900 dark:text-stone-100">
                Join the Senate
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-8 text-lg">
                Get the full story delivered to your inbox. New chronicles, exclusive content, and first access to the mischief.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="citizen@empire.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                />
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white px-8">
                  Subscribe
                </Button>
              </form>

              <p className="text-stone-500 text-sm mt-4">
                No spam. Just satire. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Instagram CTA */}
        <section className="py-16 border-t border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-8 md:p-12 text-white text-center">
                <Instagram className="h-16 w-16 mx-auto mb-6 opacity-90" />
                <h2 className="font-display text-3xl md:text-4xl mb-4">
                  The Daily Dispatch
                </h2>
                <p className="text-white/90 mb-6 text-lg max-w-xl mx-auto">
                  New stories drop daily on Instagram. Follow for the first half of each chronicle, then come back here for the full story.
                </p>
                <a
                  href="https://www.instagram.com/corporatepranks"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90 gap-2 px-8">
                    <Instagram className="h-5 w-5" />
                    @corporatepranks
                  </Button>
                </a>
                <p className="text-white/70 text-sm mt-4">
                  18,000+ citizens and counting
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
