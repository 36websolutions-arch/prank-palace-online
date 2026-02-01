import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scroll, ArrowRight, Search, BookOpen, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Blog {
  id: string;
  title: string;
  image: string | null;
  published_at: string | null;
  content: string;
  href?: string; // For static chronicles
  isStatic?: boolean;
}

// Static chronicles that have dedicated pages
const staticChronicles: Blog[] = [
  {
    id: "the-performance-review",
    title: "The Performance Review",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=500&fit=crop",
    published_at: "2026-01-30",
    content: "Marcus had survived twelve quarters. In the arena, they called him Marcellus the Adequate — not because he was merely adequate, but because adequacy was the highest praise the Senate would allow.",
    href: "/chronicle/the-performance-review",
    isStatic: true,
  },
  {
    id: "the-all-hands-meeting",
    title: "The All-Hands Meeting",
    image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&h=500&fit=crop",
    published_at: "2026-01-31",
    content: "The horn sounded at the third hour. Attendance was mandatory. Enthusiasm was expected. Comprehension was optional.",
    href: "/chronicle/the-all-hands-meeting",
    isStatic: true,
  },
  {
    id: "the-return-to-office",
    title: "The Return to Office",
    image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=500&fit=crop",
    published_at: "2026-02-01",
    content: "The Forum was remodeled, the banners were hung, and the Senate declared the return mandatory. Remote work, they said, was destroying the culture.",
    href: "/chronicle/the-return-to-office",
    isStatic: true,
  },
];

export default function Chronicles() {
  const [dbStories, setDbStories] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    setDbStories(data || []);
    setLoading(false);
  };

  // Combine static and database chronicles
  const allStories = [...staticChronicles, ...dbStories];

  // Filter based on search
  const filteredStories = searchQuery.trim() === ""
    ? allStories
    : allStories.filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.content.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Group stories by year for the archive view
  const storiesByYear = filteredStories.reduce((acc, story) => {
    const year = story.published_at
      ? new Date(story.published_at).getFullYear().toString()
      : "Unknown";
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(story);
    return acc;
  }, {} as Record<string, Blog[]>);

  const years = Object.keys(storiesByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-stone-200 dark:border-stone-800 py-16">
          {/* Parchment texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 mb-6">
                <Scroll className="h-10 w-10 text-amber-600" />
              </div>

              <h1 className="font-display text-5xl md:text-6xl text-stone-900 dark:text-stone-100 mb-6">
                The Chronicle Archives
              </h1>

              <p className="text-xl text-stone-600 dark:text-stone-400 mb-8 font-serif italic">
                "Every scroll tells a story the Senate wished remained hidden."
              </p>

              {/* Search */}
              <div className="max-w-md mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Search the archives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700"
                />
              </div>

              <p className="text-stone-500 text-sm mt-4">
                {filteredStories.length} chronicle{filteredStories.length !== 1 ? "s" : ""} in the archives
              </p>
            </div>
          </div>
        </section>

        {/* Featured Chronicles */}
        <section className="py-12 border-b border-stone-200 dark:border-stone-800 bg-amber-50/50 dark:bg-amber-950/10">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-5 w-5 text-amber-600" />
              <h2 className="font-display text-xl text-stone-900 dark:text-stone-100">Featured Chronicles</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {staticChronicles.map((chronicle) => (
                <Link
                  key={chronicle.id}
                  to={chronicle.href!}
                  className="group bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-stone-200 dark:border-stone-800"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img
                      src={chronicle.image!}
                      alt={chronicle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3">
                      <span className="px-2 py-1 bg-amber-600 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-stone-500 text-sm mb-2">
                      {chronicle.published_at && format(new Date(chronicle.published_at), "MMMM d, yyyy")}
                    </p>
                    <h3 className="font-display text-xl text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors mb-2">
                      {chronicle.title}
                    </h3>
                    <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-2 font-serif mb-4">
                      {chronicle.content.substring(0, 100)}...
                    </p>
                    <span className="inline-flex items-center gap-2 text-amber-600 text-sm font-medium group-hover:gap-3 transition-all">
                      Read Chronicle <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Archive List */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {loading ? (
              <ChronicleLoader />
            ) : filteredStories.length === 0 ? (
              <div className="text-center py-16">
                <Scroll className="h-16 w-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
                <h3 className="font-display text-2xl text-stone-700 dark:text-stone-300 mb-2">
                  {searchQuery ? "No chronicles found" : "The Archives Are Empty"}
                </h3>
                <p className="text-stone-500">
                  {searchQuery
                    ? "Try a different search term"
                    : "New chronicles are being written. Check back soon."}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-12">
                {years.map((year) => (
                  <div key={year}>
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="h-5 w-5 text-amber-600" />
                      <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
                        {year === "Unknown" ? "Undated" : year}
                      </h2>
                      <span className="text-stone-500 text-sm">
                        ({storiesByYear[year].length} chronicle{storiesByYear[year].length !== 1 ? "s" : ""})
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {storiesByYear[year].map((story) => (
                        <Link
                          key={story.id}
                          to={story.href || `/blog/${story.id}`}
                          className="group bg-white dark:bg-stone-900 rounded-lg overflow-hidden shadow hover:shadow-lg transition-all duration-300 border border-stone-200 dark:border-stone-800"
                        >
                          {story.image ? (
                            <div className="aspect-[16/10] overflow-hidden relative">
                              <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                          ) : (
                            <div className="aspect-[16/10] bg-gradient-to-br from-amber-100 to-stone-200 dark:from-amber-900/20 dark:to-stone-800 flex items-center justify-center">
                              <Scroll className="h-12 w-12 text-amber-600/30" />
                            </div>
                          )}
                          <div className="p-5">
                            {story.published_at && (
                              <p className="text-stone-500 text-sm mb-2">
                                {format(new Date(story.published_at), "MMMM d, yyyy")}
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
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
