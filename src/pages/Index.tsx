import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { JokerLoader } from "@/components/JokerLoader";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Laugh, ArrowRight, RefreshCw, Zap, FileText, Calendar } from "lucide-react";
import { format } from "date-fns";
import logo from "@/assets/logo.png";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

interface Blog {
  id: string;
  title: string;
  image: string | null;
  published_at: string | null;
  content: string;
}

export default function Index() {
  const [subscriptionProducts, setSubscriptionProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchBlogs();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("type", "subscription")
      .order("created_at", { ascending: false })
      .limit(4);
    setSubscriptionProducts(data || []);
    setLoadingProducts(false);
  };

  const fetchBlogs = async () => {
    const { data } = await supabase
      .from("blogs")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(3);
    setBlogs(data || []);
    setLoadingBlogs(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden joker-pattern">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-block mb-6 animate-bounce-in">
              <img 
                src={logo} 
                alt="Corporate Pranks" 
                className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto animate-gentle-float"
              />
            </div>
            <h1 className="font-display text-5xl lg:text-7xl mb-6 animate-fade-in-up">
              Unleash the <span className="text-gradient-joker">Chaos!</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up animate-delay-100">
              The ultimate destination for office mischief, digital mayhem, and prank perfection. 
              Your coworkers won't know what hit them! 😈
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animate-delay-200">
              <Link to="/subscription-products">
                <Button variant="joker" size="xl" className="gap-2 w-full sm:w-auto">
                  <RefreshCw className="h-5 w-5" /> Strange Interests Initiative
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-10 text-4xl float-animation opacity-20">🎭</div>
          <div className="absolute bottom-20 right-10 text-4xl float-animation-delayed opacity-20">🎪</div>
          <div className="absolute top-40 right-20 text-3xl wiggle opacity-20">🪲</div>
        </section>

        {/* Subscription Products Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-3xl lg:text-4xl">Strange Interests Initiative</h2>
                  <p className="text-muted-foreground">Gift the chaos that keeps on giving! 🎁</p>
                </div>
              </div>
              <Link to="/subscription-products">
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loadingProducts ? (
              <JokerLoader />
            ) : subscriptionProducts.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border">
                <span className="text-5xl mb-4 inline-block">🔄</span>
                <p className="text-muted-foreground">No subscription pranks available yet... Stay tuned! 😏</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {subscriptionProducts.map((product) => (
                  <ProductCard key={product.id} {...product} type="subscription" />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Social Media Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="font-display text-4xl mb-3">Join the Chaos Community! 🎉</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Follow us for daily prank inspiration, behind-the-scenes mischief, and exclusive chaos content!
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Instagram Card */}
              <a 
                href="https://www.instagram.com/corporatepranks?igsh=MWpzYjhwanJ2em1oZg%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-card p-6 rounded-xl shadow-card text-center hover:-translate-y-2 transition-all duration-300 border border-border hover:border-primary"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl mb-2">Instagram</h3>
                <p className="text-muted-foreground text-sm">Prank pics & stories 📸</p>
              </a>

              {/* Facebook Card */}
              <a 
                href="https://www.facebook.com/share/17SVwQDomH/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-card p-6 rounded-xl shadow-card text-center hover:-translate-y-2 transition-all duration-300 border border-border hover:border-primary"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#1877F2] text-white mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl mb-2">Facebook</h3>
                <p className="text-muted-foreground text-sm">Join the community 👥</p>
              </a>

              {/* TikTok Card */}
              <a 
                href="https://www.tiktok.com/@corporatepranks?_r=1&_t=ZT-93Djie0hXQM" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-card p-6 rounded-xl shadow-card text-center hover:-translate-y-2 transition-all duration-300 border border-border hover:border-primary"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl mb-2">TikTok</h3>
                <p className="text-muted-foreground text-sm">Viral prank videos 🎬</p>
              </a>

              {/* YouTube Card */}
              <a 
                href="https://youtube.com/@corporatepranks?si=2r8t3Mv6-GqpN-dO" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-card p-6 rounded-xl shadow-card text-center hover:-translate-y-2 transition-all duration-300 border border-border hover:border-primary"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF0000] text-white mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3 className="font-display text-xl mb-2">YouTube</h3>
                <p className="text-muted-foreground text-sm">Full prank tutorials 🎥</p>
              </a>
            </div>
          </div>
        </section>

        {/* Blogs Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-display text-3xl lg:text-4xl">Prank Wisdom Blog</h2>
                  <p className="text-muted-foreground">Tips, tricks, and tales of mischief! 📰</p>
                </div>
              </div>
            </div>

            {loadingBlogs ? (
              <JokerLoader />
            ) : blogs.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border">
                <span className="text-5xl mb-4 inline-block">📝</span>
                <p className="text-muted-foreground">No blog posts yet... Check back for prank wisdom! 😏</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    to={`/blog/${blog.id}`}
                    className="group bg-card rounded-xl overflow-hidden shadow-card hover:-translate-y-2 transition-all duration-300 border border-border hover:border-primary"
                  >
                    {blog.image ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-secondary flex items-center justify-center">
                        <FileText className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {blog.published_at
                            ? format(new Date(blog.published_at), "MMM d, yyyy")
                            : "Recently"}
                        </span>
                      </div>
                      <h3 className="font-display text-xl mb-2 group-hover:text-primary transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {blog.content.substring(0, 120)}...
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>


        {/* Features */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-4xl text-center mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <RefreshCw className="h-8 w-8" />, title: "Recurring Mischief", desc: "Join the prank pipeline and send pranks on a schedule. The gift that keeps on giving!" },
                { icon: <Zap className="h-8 w-8" />, title: "Instant Setup", desc: "Set up your subscription in minutes and start spreading chaos right away!" },
                { icon: <ShieldCheck className="h-8 w-8" />, title: "Secure Checkout", desc: "PayPal protected payments. Your prank purchases are safe and sound." },
              ].map((feature, i) => (
                <div key={i} className="bg-card p-6 rounded-xl shadow-card text-center group hover:-translate-y-2 transition-transform">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-display text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-joker text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <Laugh className="h-16 w-16 mx-auto mb-6 animate-wiggle" />
            <h2 className="font-display text-4xl mb-4">Ready to become that coworker? ✅</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Enter the Prank Pipeline. Ridiculousness delivered.
            </p>
            <Link to="/subscription-products">
              <Button variant="gold" size="xl">Join the Initiative</Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
