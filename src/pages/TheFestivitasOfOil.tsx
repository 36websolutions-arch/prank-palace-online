import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LikeButton } from "@/components/LikeButton";
import { ShareButton } from "@/components/ShareButton";
import { supabase } from "@/integrations/supabase/client";
import {
  Scroll,
  ArrowLeft,
  Heart,
  ShoppingBag,
  Instagram,
  BookOpen,
  Clock,
  Unlock,
  Shield,
  Award,
  Droplets
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

const STORY_TITLE = "The Festivitas of Oil";
const STORY_SUBTITLE = "A Chronicle from the Corporate Empire";

const STORY_PREVIEW = `The merchants arrived at the villa carrying one thousand amphorae of oil.

Not olive oil. Not lamp oil. Not the sacred oil used to anoint generals before battle. This was a different kind of oil — the kind purchased in bulk by a man who had clearly confused excess with excellence and volume with virtue.

The man's name was Didacticus. He was Rome's most celebrated entertainer — a merchant of music whose songs were heard in every tavern, bathhouse, and gladiatorial after-party from the Colosseum to Carthage. He owned estates in every province. He wore robes that cost more than entire neighborhoods. He threw gatherings so elaborate that the Senate once debated whether they constituted a public health emergency.

They called them "Festivitas."

"How much oil did they seize?" Cassius asked, reading the morning scroll.

Marcus glanced over. "One thousand amphorae. And lubricants. And extra linens."

"Extra linens?"

"For the oil."

Cassius set down his bread. He had served Rome for many years. He had watched Senators embezzle, Consuls lie, and the Praetorian Guard look away at precisely scheduled intervals. But one thousand amphorae of oil, stored in advance, with dedicated linens, in hotel chambers booked under false names — that was logistics. That was supply chain management. That was a man who had turned depravity into an operations manual.

"There was also a pool," Marcus continued.

"A pool of what?"

"Oil."

"A pool. Of oil."

"At the Montague Baths in Beverlyicus Hills. He filled an entire bathing pool with oil and invited guests to enter."

Brutus appeared from behind a column. He had been listening. He always listened.

"Guests," he repeated. "That's what we're calling them."`;

const STORY_FULL = `The merchants arrived at the villa carrying one thousand amphorae of oil.

Not olive oil. Not lamp oil. Not the sacred oil used to anoint generals before battle. This was a different kind of oil — the kind purchased in bulk by a man who had clearly confused excess with excellence and volume with virtue.

The man's name was Didacticus. He was Rome's most celebrated entertainer — a merchant of music whose songs were heard in every tavern, bathhouse, and gladiatorial after-party from the Colosseum to Carthage. He owned estates in every province. He wore robes that cost more than entire neighborhoods. He threw gatherings so elaborate that the Senate once debated whether they constituted a public health emergency.

They called them "Festivitas."

"How much oil did they seize?" Cassius asked, reading the morning scroll.

Marcus glanced over. "One thousand amphorae. And lubricants. And extra linens."

"Extra linens?"

"For the oil."

Cassius set down his bread. He had served Rome for many years. He had watched Senators embezzle, Consuls lie, and the Praetorian Guard look away at precisely scheduled intervals. But one thousand amphorae of oil, stored in advance, with dedicated linens, in hotel chambers booked under false names — that was logistics. That was supply chain management. That was a man who had turned depravity into an operations manual.

"There was also a pool," Marcus continued.

"A pool of what?"

"Oil."

"A pool. Of oil."

"At the Montague Baths in Beverlyicus Hills. He filled an entire bathing pool with oil and invited guests to enter."

Brutus appeared from behind a column. He had been listening. He always listened.

"Guests," he repeated. "That's what we're calling them."

---

The trial had been the most watched spectacle in Rome since the Colosseum added luxury boxes.

Didacticus stood before the magistrate in robes worth more than the courthouse itself. His defense argued that the oil was recreational. That the gatherings were consensual. That a man who owned half the music in the Empire was entitled to his private entertainments, however slippery they might be.

The prosecution said otherwise. The victims — workers, performers, people who had entered the villa expecting one thing and discovered something far worse — described events that lasted days. They described being drugged. They described being unable to leave. They described a machine that ran on oil and silence and the understanding that Didacticus was too powerful to be stopped.

The jury found him guilty on two counts. Not all five. Two.

"Two out of five," Cassius said. "That's the going rate for a man who owns senators."

Didacticus was sentenced to four years. His supporters celebrated outside the courthouse. Some of them brought oil.

---

But the timing was what disturbed Marcus most.

Because while Didacticus was being sentenced for his oil-soaked festivities, the Praetorian Guard was simultaneously releasing three and a half million scrolls from the archives of Epsteinius — the dead merchant who had operated an island where the powerful visited and the powerless disappeared.

Two empires of exploitation. Two systems of procurement. Two men who had built entire infrastructures around the same understanding: that when you are wealthy enough, people become inventory.

Epsteinius had his island. Didacticus had his hotels. Both had ledgers. Both had guest lists. Both had guards at the door and silence as the cost of entry.

And Rome — mighty, eternal, justice-loving Rome — had spent years doing precisely nothing about either of them.

"Someone knew," Brutus said quietly. "About both of them. For years. Someone always knows."

Marcus nodded. "Everyone knew. That's the part they never say out loud. Everyone in the Senate, every merchant who attended, every Praetorian who looked the other way. They all knew. Knowing isn't the problem. The problem is that knowing was never meant to lead to action. Knowing was the currency. You knew about Didacticus, he knew about you, and the oil kept everyone too slippery to pin down."

---

THE PARALLEL

Two thousand years later, Sean Combs sits in a federal prison in New Jersey. Four years and two months.

The feds seized over a thousand bottles of baby oil from his properties. His ex-girlfriend testified about a pool filled with it at the Montage Beverly Hills. The "Freak Offs" lasted for days. Workers were drugged. AR-15s with defaced serial numbers were found alongside the lubricant, which is perhaps the most American inventory list ever compiled.

Meanwhile, the Epstein files sit in a public library that 3.5 million pages deep. Names of billionaires, politicians, and princes. Photographs that should not exist. Flight logs to an island that everyone knew about and nobody stopped.

Both men operated for decades. Both had guest lists full of people who are still giving speeches, running companies, and posting motivational content on LinkedIn. Both built systems — not moments of weakness, but systems — designed to procure, exploit, and discard human beings.

Diddy got four years. Epstein got a broken neck in a cell with no cameras.

And the guests — the ones on both lists, the ones who attended the festivities and visited the island and knew exactly what was happening behind every locked door — got nothing.

They got press conferences. They got "no recollection." They got lawyers who released statements that said "my client's presence at these events has been mischaracterized."

The oil has been cleaned up. The island has been scrubbed. The files are public. The names are known.

And still, somehow, the people who walked through those doors walk free.

Because in Rome, the host takes the fall. The guests go home. And the Empire keeps turning, slick and unbothered, as if nothing ever happened.

Nothing ever happens.

That is, and has always been, the arrangement.

---

The Corporate Chronicle
Satire Since Rome`;

export default function TheFestivitasOfOil() {
  const [products, setProducts] = useState<Product[]>([]);
  const [email, setEmail] = useState("");
  const [showFullStory, setShowFullStory] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4);
    setProducts(data || []);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFullStory(true);
    alert("Ave, Citizen! You have been granted access to the Senate Archives.");
    setEmail("");
  };

  const readTime = 12;

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        <header className="relative bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 opacity-10 hidden lg:block"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px)`,
            }}
          />
          <div className="absolute right-0 top-0 bottom-0 w-16 opacity-10 hidden lg:block"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.1) 40px, rgba(255,255,255,0.1) 42px)`,
            }}
          />

          <div className="container mx-auto px-4 py-10 relative">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-stone-400 hover:text-amber-400 transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to The Chronicles
            </Link>

            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 font-bold tracking-wider text-sm">CHRONICLE VII</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl opacity-60">🏛️</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <Droplets className="h-8 w-8 text-amber-500" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <span className="text-3xl opacity-60">🏛️</span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl mb-4 tracking-tight">
                {STORY_TITLE}
              </h1>

              <p className="text-xl text-amber-400 font-serif italic mb-6">
                {STORY_SUBTITLE}
              </p>

              <div className="flex items-center justify-center gap-6 text-stone-400 text-sm">
                <span className="flex items-center gap-2">
                  <Scroll className="h-4 w-4" />
                  February VIII, MMXXVI
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Senate Scandals
                </span>
              </div>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <article className="lg:col-span-2">
              <div className="bg-stone-50 dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />

                <div className="p-8 md:p-12">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-3">
                      <LikeButton chronicleId="the-festivitas-of-oil" />
                      <ShareButton title="The Festivitas of Oil" />
                    </div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider">
                      Scroll VII of VII
                    </div>
                  </div>

                  <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
                    {showFullStory ? (
                      <>
                        <div className="flex items-center gap-2 mb-6 text-green-600 dark:text-green-400">
                          <Unlock className="h-5 w-5" />
                          <span className="text-sm font-medium uppercase tracking-wider">Full Chronicle Unlocked</span>
                        </div>
                        <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                          {STORY_FULL}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                          {STORY_PREVIEW}
                        </div>

                        <div className="relative mt-12">
                          <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 dark:from-stone-900 to-transparent pointer-events-none" />

                          <div
                            className="relative overflow-hidden rounded-xl text-white animate-[breathe_4s_ease-in-out_infinite]"
                            style={{
                              background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
                              boxShadow: '0 0 60px rgba(217, 119, 6, 0.4), 0 0 100px rgba(217, 119, 6, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                            }}
                          >
                            <div
                              className="absolute inset-0 animate-[shimmer_3s_ease-in-out_infinite]"
                              style={{
                                background: 'linear-gradient(110deg, transparent 20%, rgba(217,119,6,0.15) 50%, transparent 80%)',
                                backgroundSize: '200% 100%',
                              }}
                            />

                            <div className="absolute inset-0 rounded-xl border-2 border-amber-500/60 animate-pulse" />
                            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                            <div className="relative z-10 p-8 md:p-10 text-center">
                              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-500/50 mb-6 animate-[bounce_3s_ease-in-out_infinite]">
                                <Unlock className="h-10 w-10 text-amber-400" />
                              </div>

                              <div className="flex items-center justify-center gap-2 mb-4">
                                <div className="h-px w-8 bg-amber-500/50" />
                                <Droplets className="h-5 w-5 text-amber-500" />
                                <div className="h-px w-8 bg-amber-500/50" />
                              </div>

                              <h3 className="font-display text-2xl md:text-3xl mb-3">
                                One Thousand Amphorae. Zero Consequences.
                              </h3>
                              <p className="text-stone-300 mb-8 max-w-md mx-auto">
                                Enter your email to unlock the full chronicle and join the Senate.
                              </p>

                              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
                                <Input
                                  type="email"
                                  placeholder="citizen@empire.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                  className="flex-1 h-14 bg-white/10 border-2 border-amber-500/40 text-white placeholder:text-stone-400 text-lg focus:border-amber-400 focus:ring-amber-400/50 rounded-lg"
                                />
                                <Button
                                  type="submit"
                                  className="h-14 px-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-900 font-bold text-lg gap-2 transition-all hover:scale-105 rounded-lg shadow-lg shadow-amber-500/25"
                                >
                                  <Unlock className="h-5 w-5" />
                                  Unlock Chronicle
                                </Button>
                              </form>

                              <button
                                onClick={() => setShowFullStory(true)}
                                className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
                              >
                                Continue as Guest
                              </button>
                            </div>

                            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />
              </div>

              {showFullStory && (
                <div className="mt-8 p-8 bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 text-white">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Award className="h-8 w-8 text-amber-400" />
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-display text-xl mb-2">
                        Chronicle Complete
                      </h3>
                      <p className="text-stone-400">
                        Follow @corporatepranks for daily dispatches from the Corporate Empire.
                      </p>
                    </div>
                    <a
                      href="https://www.instagram.com/corporatepranks"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white px-6">
                        <Instagram className="h-5 w-5" />
                        Follow
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </article>

            <aside className="space-y-6">
              <div className="lg:sticky lg:top-24 space-y-6">
                <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl p-6 text-white border border-stone-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 uppercase tracking-wider">Your Rank</p>
                      <p className="font-display text-lg text-amber-400">Citizen</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-stone-400">Chronicles Read</span>
                      <span className="text-white font-medium">7 / 7</span>
                    </div>
                    <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                    </div>
                    <p className="text-xs text-stone-500">Read more to rank up to Senator</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-red-500" />
                    <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">Fund the Resistance</h3>
                  </div>
                  <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">
                    Help us keep exposing the absurdity. Every denarius counts.
                  </p>
                  <Link to="/support">
                    <Button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold">
                      Support the Chronicle
                    </Button>
                  </Link>
                </div>

                {products.length > 0 && (
                  <div className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-2 mb-4">
                      <ShoppingBag className="h-5 w-5 text-amber-600" />
                      <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">
                        Tools of Mischief
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
                      <Button variant="outline" className="w-full mt-4 border-stone-300 dark:border-stone-600">
                        Browse All
                      </Button>
                    </Link>
                  </div>
                )}

                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-xl p-6 text-white text-center">
                  <Instagram className="h-10 w-10 mx-auto mb-3 opacity-90" />
                  <h3 className="font-display text-lg mb-2">Daily Dispatches</h3>
                  <p className="text-white/80 text-sm mb-4">
                    New stories drop daily
                  </p>
                  <a
                    href="https://www.instagram.com/corporatepranks"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-white text-purple-600 hover:bg-white/90">
                      @corporatepranks
                    </Button>
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <section className="py-16 bg-stone-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12 bg-amber-500/50" />
              <BookOpen className="h-6 w-6 text-amber-500" />
              <h2 className="font-display text-2xl">More Chronicles</h2>
              <div className="h-px w-12 bg-amber-500/50" />
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link
                to="/chronicle/the-scrolls-of-the-island"
                className="bg-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-wider">CHRONICLE VI</span>
                </div>
                <h3 className="font-display text-xl text-white group-hover:text-amber-400 transition-colors">
                  The Scrolls of the Island
                </h3>
                <p className="text-stone-400 text-sm mt-2">
                  3.5 million scrolls. Washable ink. Nothing happens.
                </p>
              </Link>

              <Link
                to="/chronicle/the-war-of-the-oracles"
                className="bg-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-wider">CHRONICLE V</span>
                </div>
                <h3 className="font-display text-xl text-white group-hover:text-amber-400 transition-colors">
                  The War of the Oracles
                </h3>
                <p className="text-stone-400 text-sm mt-2">
                  Consul Altmanius is exceptionally testy. The circuses are sponsored by venture capital.
                </p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
