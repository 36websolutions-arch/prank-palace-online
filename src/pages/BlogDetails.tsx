import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Scroll } from "lucide-react";
import { format } from "date-fns";

interface Blog {
  id: string;
  title: string;
  content: string;
  image: string | null;
  published_at: string | null;
  created_at: string;
}

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", id)
      .eq("is_published", true)
      .single();

    if (!error && data) {
      setBlog(data);
    }
    setLoading(false);
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

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <Scroll className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="font-display text-4xl text-stone-900 dark:text-stone-100 mb-4">Chronicle Not Found</h1>
          <p className="text-stone-600 dark:text-stone-400 mb-8">
            This chronicle has been lost to the ages.
          </p>
          <Link to="/">
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="flex-1">
        {/* Hero Image */}
        {blog.image && (
          <div className="w-full h-64 md:h-96 relative">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/" className="inline-block mb-6">
            <Button variant="ghost" className="gap-2 text-stone-600 dark:text-stone-400 hover:text-amber-600">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Title and Date */}
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-stone-100 mb-4">{blog.title}</h1>
            <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400 mb-8">
              <Calendar className="h-4 w-4" />
              <span>
                {blog.published_at
                  ? format(new Date(blog.published_at), "MMMM d, yyyy")
                  : format(new Date(blog.created_at), "MMMM d, yyyy")}
              </span>
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none prose-stone dark:prose-invert">
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-stone-700 dark:text-stone-300 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Share CTA */}
            <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/50 mb-3">
                <Scroll className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-display text-xl text-stone-900 dark:text-stone-100 mb-2">Enjoyed this chronicle?</h3>
              <p className="text-stone-600 dark:text-stone-400 mb-4">
                Explore more stories from the Corporate Chronicle.
              </p>
              <Link to="/subscription-products">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">Explore Subscriptions</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
