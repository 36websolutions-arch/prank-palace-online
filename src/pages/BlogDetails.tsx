import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JokerLoader } from "@/components/JokerLoader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <JokerLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <span className="text-6xl mb-6 inline-block">🔍</span>
          <h1 className="font-display text-4xl mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-8">
            This prank wisdom seems to have vanished into thin air! 👻
          </p>
          <Link to="/">
            <Button variant="joker" className="gap-2">
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
    <div className="min-h-screen flex flex-col">
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
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link to="/" className="inline-block mb-6">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          {/* Title and Date */}
          <div className="max-w-3xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl mb-4">{blog.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-8">
              <Calendar className="h-4 w-4" />
              <span>
                {blog.published_at
                  ? format(new Date(blog.published_at), "MMMM d, yyyy")
                  : format(new Date(blog.created_at), "MMMM d, yyyy")}
              </span>
            </div>

            {/* Content */}
            <article className="prose prose-lg max-w-none">
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-foreground/90 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Share CTA */}
            <div className="mt-12 p-6 bg-secondary rounded-xl text-center">
              <span className="text-3xl mb-3 inline-block">🎭</span>
              <h3 className="font-display text-xl mb-2">Enjoyed this read?</h3>
              <p className="text-muted-foreground mb-4">
                Join the chaos community and spread the mischief!
              </p>
              <Link to="/subscription-products">
                <Button variant="joker">Explore the Prank Pipeline</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
