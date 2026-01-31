import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChronicleLoader } from "@/components/ChronicleLoader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Scroll as ScrollIcon,
  Crown,
  Package,
  Zap,
  RefreshCw,
  ArrowRight,
  ExternalLink,
  Headphones,
  Coffee,
  BookOpen,
  Heart
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

// Affiliate products - Roman-themed Amazon recommendations
const affiliateProducts = [
  {
    id: "aff-1",
    name: "Noise-Canceling Headphones",
    tagline: "Block out the synergy",
    description: "When the all-hands meeting gets too real",
    icon: Headphones,
    amazonUrl: "#", // User will add actual affiliate links
  },
  {
    id: "aff-2",
    name: "Premium Coffee",
    tagline: "Gladiator Fuel",
    description: "Survive another day in the arena",
    icon: Coffee,
    amazonUrl: "#",
  },
  {
    id: "aff-3",
    name: "Corporate Survival Guides",
    tagline: "Forbidden Senate Readings",
    description: "What they don't want you to know",
    icon: BookOpen,
    amazonUrl: "#",
  },
];

export default function Armory() {
  const [physicalProducts, setPhysicalProducts] = useState<Product[]>([]);
  const [digitalProducts, setDigitalProducts] = useState<Product[]>([]);
  const [subscriptionProducts, setSubscriptionProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setPhysicalProducts(data.filter((p) => p.type === "physical"));
      setDigitalProducts(data.filter((p) => p.type === "digital"));
      setSubscriptionProducts(data.filter((p) => p.type === "subscription"));
    }
    setLoading(false);
  };

  const ProductCard = ({ product, badgeText, badgeIcon: BadgeIcon }: { product: Product; badgeText: string; badgeIcon: React.ElementType }) => (
    <Link
      to={product.type === "subscription" ? `/subscription-checkout/${product.id}` : `/product/${product.id}`}
      className="group bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden hover:shadow-lg hover:border-amber-500/50 transition-all duration-300"
    >
      <div className="aspect-square bg-stone-100 dark:bg-stone-800 relative overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            {product.type === "physical" ? "🛡️" : product.type === "digital" ? "📜" : "👑"}
          </div>
        )}
        <Badge className="absolute top-3 right-3 gap-1 bg-amber-600 text-white">
          <BadgeIcon className="h-3 w-3" />
          {badgeText}
        </Badge>
        {/* Wax Seal */}
        <div className="absolute bottom-3 left-3 w-10 h-10 bg-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-red-800">
          S.A.
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 mb-1 group-hover:text-amber-600 transition-colors">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-stone-600 dark:text-stone-400 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <p className="text-amber-600 font-bold text-lg">${product.price}</p>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-stone-200 dark:border-stone-800 py-16 lg:py-20">
          {/* Parchment texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 mb-6">
                <Shield className="h-10 w-10 text-amber-600" />
              </div>

              <h1 className="font-display text-5xl md:text-6xl text-stone-900 dark:text-stone-100 mb-6">
                The Armory
              </h1>

              <p className="text-xl text-stone-600 dark:text-stone-400 mb-4 font-serif italic">
                "Equip yourself for the corporate battlefield."
              </p>

              <p className="text-stone-500 dark:text-stone-500 max-w-xl mx-auto">
                From physical tools of mischief to digital scrolls of wisdom, find everything you need to survive the empire.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Navigation */}
        <section className="py-8 bg-stone-100 dark:bg-stone-900/50 border-b border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#tools-of-mischief" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-500 transition-colors">
                <Package className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Tools of Mischief</span>
              </a>
              <a href="#senate-archives" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-500 transition-colors">
                <ScrollIcon className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Senate Archives</span>
              </a>
              <a href="#imperial-tribute" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-500 transition-colors">
                <Crown className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Imperial Tribute</span>
              </a>
              <a href="#imperial-marketplace" className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-500 transition-colors">
                <Zap className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">Imperial Marketplace</span>
              </a>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="py-16">
            <ChronicleLoader />
          </div>
        ) : (
          <>
            {/* Tools of Mischief - Physical Products */}
            <section id="tools-of-mischief" className="py-16 border-b border-stone-200 dark:border-stone-800">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Package className="h-6 w-6 text-amber-600" />
                    <div>
                      <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100">The Citizen's Armory</h2>
                      <p className="text-stone-500 text-sm">Tools of Mischief - Physical goods for the modern gladiator</p>
                    </div>
                  </div>
                  <Link to="/physical-products">
                    <Button variant="outline" className="gap-2 border-stone-300 dark:border-stone-700">
                      View All <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {physicalProducts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {physicalProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} badgeText="Physical" badgeIcon={Package} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-stone-100 dark:bg-stone-900 rounded-lg border border-dashed border-stone-300 dark:border-stone-700">
                    <Package className="h-12 w-12 text-stone-400 mx-auto mb-3" />
                    <p className="text-stone-500">Physical armory being restocked. Check back soon.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Senate Archives - Digital Products */}
            <section id="senate-archives" className="py-16 border-b border-stone-200 dark:border-stone-800 bg-amber-50/30 dark:bg-amber-950/10">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <ScrollIcon className="h-6 w-6 text-amber-600" />
                    <div>
                      <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100">Senate Archives</h2>
                      <p className="text-stone-500 text-sm">Digital scrolls - Instant delivery, maximum value</p>
                    </div>
                  </div>
                  <Link to="/digital-products">
                    <Button variant="outline" className="gap-2 border-stone-300 dark:border-stone-700">
                      View All <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {digitalProducts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {digitalProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} badgeText="Digital" badgeIcon={Zap} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-lg border border-dashed border-stone-300 dark:border-stone-700">
                    <ScrollIcon className="h-12 w-12 text-stone-400 mx-auto mb-3" />
                    <p className="text-stone-500">Digital archives being transcribed. Check back soon.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Imperial Tribute - Subscriptions */}
            <section id="imperial-tribute" className="py-16 border-b border-stone-200 dark:border-stone-800">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Crown className="h-6 w-6 text-amber-600" />
                    <div>
                      <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100">Imperial Tribute</h2>
                      <p className="text-stone-500 text-sm">Ongoing subscriptions - Regular deliveries for ongoing value</p>
                    </div>
                  </div>
                  <Link to="/subscription-products">
                    <Button variant="outline" className="gap-2 border-stone-300 dark:border-stone-700">
                      View All <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                {subscriptionProducts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subscriptionProducts.slice(0, 4).map((product) => (
                      <ProductCard key={product.id} product={product} badgeText="Ongoing" badgeIcon={RefreshCw} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-stone-100 dark:bg-stone-900 rounded-lg border border-dashed border-stone-300 dark:border-stone-700">
                    <Crown className="h-12 w-12 text-stone-400 mx-auto mb-3" />
                    <p className="text-stone-500">Subscription offerings being prepared. Check back soon.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Imperial Marketplace - Affiliate Products */}
            <section id="imperial-marketplace" className="py-16 bg-gradient-to-br from-stone-100 to-amber-50 dark:from-stone-900 dark:to-amber-950/20 border-b border-stone-200 dark:border-stone-800">
              <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800 text-amber-400 text-xs font-medium uppercase tracking-wider mb-4">
                    <Zap className="h-3 w-3" />
                    The Imperial Forum
                  </div>
                  <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100 mb-2">
                    The Imperial Marketplace
                  </h2>
                  <p className="text-stone-600 dark:text-stone-400 font-serif italic">
                    "Goods the Empire would prefer you not have."
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  {affiliateProducts.map((product) => (
                    <a
                      key={product.id}
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 hover:shadow-lg hover:border-amber-500/50 transition-all duration-300 overflow-hidden"
                    >
                      {/* Parchment background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20" />

                      {/* Wax seal */}
                      <div className="absolute top-3 right-3 w-8 h-8 bg-red-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow border border-red-800">
                        SA
                      </div>

                      <div className="relative">
                        <div className="w-14 h-14 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4">
                          <product.icon className="h-7 w-7 text-amber-600" />
                        </div>
                        <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 mb-1 group-hover:text-amber-600 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-amber-600 text-sm font-medium mb-2">{product.tagline}</p>
                        <p className="text-stone-500 dark:text-stone-400 text-sm">{product.description}</p>
                        <div className="flex items-center gap-1 text-amber-600 text-sm mt-4 group-hover:gap-2 transition-all">
                          View on Amazon <ExternalLink className="h-3 w-3" />
                        </div>
                      </div>
                    </a>
                  ))}
                </div>

                <p className="text-center text-stone-500 text-xs mt-8">
                  As an Amazon Associate, we earn from qualifying purchases. But we only recommend what we'd use ourselves.
                </p>
              </div>
            </section>
          </>
        )}

        {/* Support CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-stone-900 to-stone-800 rounded-2xl p-8 text-white">
              <Heart className="h-10 w-10 text-red-400 mx-auto mb-4" />
              <h2 className="font-display text-2xl mb-4">Not Ready to Buy?</h2>
              <p className="text-stone-300 mb-6">
                You can still support the Chronicle with a donation. Every denarius helps us keep exposing the absurdity.
              </p>
              <Link to="/support">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                  <Heart className="h-4 w-4" />
                  Fund the Resistance
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
