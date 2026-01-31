import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { supabase } from "@/integrations/supabase/client";
import {
  Scroll,
  ArrowLeft,
  Heart,
  Share2,
  ShoppingBag,
  Mail,
  Instagram,
  BookOpen,
  Clock,
  ArrowRight,
  MessageCircle
} from "lucide-react";
import { format } from "date-fns";

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

export default function Story() {
  const { id } = useParams();
  const [story, setStory] = useState<Blog | null>(null);
  const [relatedStories, setRelatedStories] = useState<Blog[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFullStory, setShowFullStory] = useState(false);

  useEffect(() => {
    if (id) fetchContent();
  }, [id]);

  const fetchContent = async () => {
    const [storyRes, relatedRes, productsRes] = await Promise.all([
      supabase.from("blogs").select("*").eq("id", id).single(),
      supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .neq("id", id)
        .order("published_at", { ascending: false })
        .limit(3),
      supabase.from("products").select("*").order("created_at", { ascending: false }).limit(4)
    ]);

    setStory(storyRes.data);
    setRelatedStories(relatedRes.data || []);
    setProducts(productsRes.data || []);
    setLoading(false);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFullStory(true);
    // TODO: Integrate with email service
    alert("Welcome to the Senate! Full story unlocked.");
    setEmail("");
  };

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const getPreviewContent = (content: string) => {
    // Show roughly 40% of the content as preview
    const words = content.split(/\s+/);
    const previewWordCount = Math.floor(words.length * 0.4);
    return words.slice(0, previewWordCount).join(" ");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <ChronicleLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Scroll className="h-16 w-16 text-stone-300 mx-auto mb-4" />
            <h1 className="font-display text-2xl mb-2">Chronicle Not Found</h1>
            <p className="text-stone-500 mb-4">This scroll has been lost to history.</p>
            <Link to="/">
              <Button>Return to the Chronicles</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const readTime = calculateReadTime(story.content);
  const previewContent = getPreviewContent(story.content);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        {/* Story Header */}
        <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="container mx-auto px-4 py-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to The Chronicles
            </Link>

            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full uppercase tracking-wider">
                  Chronicle
                </span>
                {story.published_at && (
                  <span className="text-stone-500 text-sm">
                    {format(new Date(story.published_at), "MMMM d, yyyy")}
                  </span>
                )}
                <span className="flex items-center gap-1 text-stone-500 text-sm">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-stone-100 mb-4">
                {story.title}
              </h1>

              {/* Social sharing */}
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Discuss
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Story Content */}
            <article className="lg:col-span-2">
              {/* Featured Image */}
              {story.image && (
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-8">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Story Text */}
              <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
                {showFullStory ? (
                  // Full story
                  <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                    {story.content}
                  </div>
                ) : (
                  // Preview with gate
                  <>
                    <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                      {previewContent}...
                    </div>

                    {/* Content Gate */}
                    <div className="relative mt-8">
                      {/* Fade overlay */}
                      <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-t from-stone-50 dark:from-stone-950 to-transparent pointer-events-none" />

                      {/* Gate CTA */}
                      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-8 text-white text-center">
                        <Scroll className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                        <h3 className="font-display text-2xl mb-2">The Story Continues...</h3>
                        <p className="text-stone-300 mb-6 max-w-md mx-auto">
                          Join the Senate to unlock the full chronicle. Get new stories delivered to your inbox.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
                          <Input
                            type="email"
                            placeholder="citizen@empire.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 bg-stone-800 border-stone-700 text-white placeholder:text-stone-500"
                          />
                          <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
                            Unlock Story
                          </Button>
                        </form>

                        <button
                          onClick={() => setShowFullStory(true)}
                          className="text-stone-500 hover:text-stone-300 text-sm underline"
                        >
                          Skip for now
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Post-story CTA */}
              {showFullStory && (
                <div className="mt-12 p-8 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/50">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <h3 className="font-display text-xl mb-2 text-stone-900 dark:text-stone-100">
                        Enjoyed this chronicle?
                      </h3>
                      <p className="text-stone-600 dark:text-stone-400">
                        Follow @corporatepranks for daily stories. New parallels between Rome and corporate America every day.
                      </p>
                    </div>
                    <a
                      href="https://www.instagram.com/corporatepranks"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
                        <Instagram className="h-5 w-5" />
                        Follow on Instagram
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar - Monetization */}
            <aside className="space-y-6">
              {/* Sticky container */}
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Support CTA */}
                <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <h3 className="font-display text-lg">Fund the Resistance</h3>
                  </div>
                  <p className="text-stone-300 text-sm mb-4">
                    Like this story? Help us keep the satire flowing.
                  </p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Support with $5
                  </Button>
                </div>

                {/* Related Products */}
                <div className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="h-5 w-5 text-amber-600" />
                    <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">
                      Tools of the Trade
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {products.slice(0, 3).map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">🎭</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-stone-900 dark:text-stone-100 truncate group-hover:text-amber-600 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-amber-600 font-bold text-sm">${product.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Link to="/subscription-products">
                    <Button variant="outline" className="w-full mt-4 border-stone-300 dark:border-stone-700">
                      Browse All
                    </Button>
                  </Link>
                </div>

                {/* Ad Space */}
                <div className="bg-stone-100 dark:bg-stone-800/50 rounded-xl p-6 border border-dashed border-stone-300 dark:border-stone-700 text-center">
                  <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Sponsored</p>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    Advertise here <br />
                    <a href="mailto:hello@corporateprank.com" className="text-amber-600 hover:underline">
                      Get rates
                    </a>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <section className="py-16 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen className="h-6 w-6 text-amber-600" />
                <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
                  More Chronicles
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedStories.map((relatedStory) => (
                  <Link
                    key={relatedStory.id}
                    to={`/story/${relatedStory.id}`}
                    className="group bg-stone-50 dark:bg-stone-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    {relatedStory.image ? (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={relatedStory.image}
                          alt={relatedStory.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-amber-100 to-stone-200 dark:from-amber-900/20 dark:to-stone-700 flex items-center justify-center">
                        <Scroll className="h-10 w-10 text-amber-600/30" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                        {relatedStory.title}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-amber-600 text-sm mt-2 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
