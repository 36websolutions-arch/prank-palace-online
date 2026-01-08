import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { JokerLoader } from "@/components/JokerLoader";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Laugh, ArrowRight, RefreshCw, Zap } from "lucide-react";
import logo from "@/assets/logo.png";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

export default function Index() {
  const [subscriptionProducts, setSubscriptionProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchProducts();
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


        {/* Features */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-4xl text-center mb-12">Why Choose Us?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <RefreshCw className="h-8 w-8" />, title: "Recurring Mischief", desc: "Subscribe and send pranks on a schedule. The gift that keeps on giving!" },
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
            <h2 className="font-display text-4xl mb-4">Ready to Start Pranking?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Browse our subscription plans and become the office legend you were meant to be!
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
