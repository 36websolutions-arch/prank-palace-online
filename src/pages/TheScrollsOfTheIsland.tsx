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
  Eye
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

const STORY_TITLE = "The Scrolls of the Island";
const STORY_SUBTITLE = "A Chronicle from the Corporate Empire";

const STORY_PREVIEW = `The Praetorian Guard released the scrolls on a Thursday.

Three and a half million of them.

They arrived in carts that stretched from the Senate steps to the harbor, each one loaded with parchment so dense that the oxen pulling them had developed a philosophical resignation normally reserved for middle management. The scrolls detailed the private dealings of a man named Epsteinius — a merchant of unspeakable tastes who had owned an island where the powerful went to do things they would later claim not to remember.

Epsteinius was dead. He had died in a Roman prison cell under circumstances that the official record described as "self-inflicted" and that everyone else described as "remarkably convenient." Two guards had been asleep. The security mirrors had malfunctioned. The backup mirrors had also malfunctioned. The backup to the backup mirrors had been reassigned to watch a storage closet.

"An unfortunate sequence of coincidences," the Praetorian Guard had announced at the time. Rome had nodded. Rome always nodded.

But now there were scrolls. Mountains of them. And the Senate, under pressure from citizens who had grown tired of nodding, had passed the Epsteinius Transparency Decree, requiring the Praetorian Guard to release everything.

Marcus unrolled the first scroll in the barracks and squinted.

"It's redacted," he said.

"What do you mean, redacted?"

"I mean someone has drawn black ink over half the names." He held the scroll up to the light. "Wait. The ink washes off."

Cassius blinked. "They used washable ink?"

"They used washable ink."`;

const STORY_FULL = `The Praetorian Guard released the scrolls on a Thursday.

Three and a half million of them.

They arrived in carts that stretched from the Senate steps to the harbor, each one loaded with parchment so dense that the oxen pulling them had developed a philosophical resignation normally reserved for middle management. The scrolls detailed the private dealings of a man named Epsteinius — a merchant of unspeakable tastes who had owned an island where the powerful went to do things they would later claim not to remember.

Epsteinius was dead. He had died in a Roman prison cell under circumstances that the official record described as "self-inflicted" and that everyone else described as "remarkably convenient." Two guards had been asleep. The security mirrors had malfunctioned. The backup mirrors had also malfunctioned. The backup to the backup mirrors had been reassigned to watch a storage closet.

"An unfortunate sequence of coincidences," the Praetorian Guard had announced at the time. Rome had nodded. Rome always nodded.

But now there were scrolls. Mountains of them. And the Senate, under pressure from citizens who had grown tired of nodding, had passed the Epsteinius Transparency Decree, requiring the Praetorian Guard to release everything.

Marcus unrolled the first scroll in the barracks and squinted.

"It's redacted," he said.

"What do you mean, redacted?"

"I mean someone has drawn black ink over half the names." He held the scroll up to the light. "Wait. The ink washes off."

Cassius blinked. "They used washable ink?"

"They used washable ink."

A silence fell over the barracks. The kind of silence that happens when the system reveals itself not as a conspiracy of genius, but as a conspiracy of laziness so profound it circles back around to genius.

---

The names, of course, were extraordinary.

Senators. Merchants. Consuls. A man who owned half the trade routes in the known world. A philosopher who had given lectures on virtue while accepting invitations to the island. A general who commanded legions by day and attended "gatherings" by night that required no armor but considerable moral flexibility.

One scroll contained correspondence between Epsteinius and Merchant Elonius, who had expressed interest in attending what was described as a "spirited gathering" on the island. Elonius denied ever setting foot on the island. His chariot's navigation history suggested otherwise, but navigation histories, like memories, are easily deleted.

Another scroll revealed that the former Consul — a man who had governed Rome for eight years and was known for his fondness for playing the lyre at state functions — had visited the island fourteen times. His office released a statement saying he had "no recollection of impropriety" and that his visits were "purely diplomatic."

"Diplomatic," Brutus repeated, reading the scroll. "He went to a private island with no diplomatic purpose fourteen times for diplomacy."

"The diplomacy must have been exceptional," Cassius said.

"The diplomacy was fifteen years old."

Nobody laughed.

---

But the most devastating revelation was not a name. It was a number.

The Deputy Praetorian, a man named Blanchius, stood before the Senate and delivered his findings.

"We have reviewed three and a half million scrolls," he said. "Thousands of correspondences. Hundreds of images. The scope of the investigation is unprecedented."

The Senate leaned forward.

"And our conclusion is that there will be no further prosecutions."

The Senate leaned back.

Three and a half million scrolls. Names of the most powerful men in the Empire. Correspondence that would make a Bacchanalian priest blush. And the official position of the Praetorian Guard was: we looked at everything, and we're going to do nothing.

"The evidence," Blanchius continued, his face arranged in the expression of a man who had practiced sincerity in a mirror, "does not allow us to necessarily prosecute somebody."

Necessarily.

The word hung in the Forum like smoke.

Not "there is no evidence." Not "these men are innocent." But "the evidence does not allow us to necessarily prosecute." The language of a system that had found the truth and decided the truth was inconvenient.

---

Meanwhile, the victims' names were everywhere.

The redactions that had been so carefully applied to the powerful had not been applied to the powerless. Forty-three names of those who had been harmed — some of whom had been children — were published in full, unprotected, visible to anyone who opened the scrolls.

The powerful got washable ink. The victims got none at all.

"They protected the names of every Senator on that island," Marcus said quietly. "And exposed the name of every child."

Cassius set down his scroll. He had survived many things in the service of Rome. He had survived performance reviews and all-hands meetings and culture realignment exercises. But this was different. This was the system telling you exactly what it valued, and exactly what it didn't, and daring you to do something about it.

---

[SCENE_BREAK]

THE PARALLEL

Two thousand years later, the Department of Justice releases 3.5 million pages related to a man who died in a cell while no one was watching.

The files name billionaires, politicians, royalty, and advisers to presidents. There are emails, flight logs, photographs that should never have been taken.

The Deputy Attorney General announces that no additional prosecutions will occur. The evidence, he says, does not "necessarily" allow it. The word "necessarily" does a lot of heavy lifting.

The redactions were so poorly done that you could copy-paste the blacked-out text into another application and read it in full. The names of over forty victims were published unredacted. Some were minors when they were abused.

Former presidents agree to be deposed on camera. A British politician is fired. Turkish prosecutors open investigations. Congress threatens contempt proceedings.

And somewhere, on a private island that has long since been scrubbed clean, the ocean continues to wash away whatever was left.

You scroll through the headlines. You recognize the names. You wait for consequences that do not come.

Because in Rome, the powerful do not face justice. They face press conferences. They release statements through their scribes. They express "no recollection" of things that happened fourteen times.

And the scrolls — all three and a half million of them — sit in a library that everyone can visit and no one can act on.

The evidence is public. The names are known. The island is empty.

Nothing happens.

Nothing was ever going to happen.

And that, citizen, is the most Roman thing of all.

---

The Corporate Chronicle
Satire Since Rome`;

export default function TheScrollsOfTheIsland() {
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
        {/* Roman Hero Header */}
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
                  <span className="text-amber-400 font-bold tracking-wider text-sm">CHRONICLE VI</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl opacity-60">🏛️</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <Eye className="h-8 w-8 text-amber-500" />
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
                  February VI, MMXXVI
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  The Archives
                </span>
              </div>
            </div>
          </div>

          <div className="h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
        </header>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <article className="lg:col-span-2">
              <div className="bg-stone-50 dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />

                <div className="p-8 md:p-12">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-3">
                      <LikeButton chronicleId="the-scrolls-of-the-island" />
                      <ShareButton title="The Scrolls of the Island" />
                    </div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider">
                      Scroll VI of VI
                    </div>
                  </div>

                  <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
                    {showFullStory ? (
                      <>
                        <div className="flex items-center gap-2 mb-6 text-green-600 dark:text-green-400">
                          <Unlock className="h-5 w-5" />
                          <span className="text-sm font-medium uppercase tracking-wider">Full Chronicle Unlocked</span>
                        </div>
                        {STORY_FULL.split("[SCENE_BREAK]").map((part, i) => (
                          <div key={i}>
                            <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                              {part}
                            </div>
                            {i === 0 && (
                              <div className="my-10 rounded-xl overflow-hidden shadow-lg border border-stone-200 dark:border-stone-700">
                                <img
                                  src="/scrolls_of_the_island_2.png"
                                  alt="The archives of the Empire — scrolls stretch into darkness as Senators avert their eyes"
                                  className="w-full h-auto"
                                />
                              </div>
                            )}
                          </div>
                        ))}
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
                                <Eye className="h-5 w-5 text-amber-500" />
                                <div className="h-px w-8 bg-amber-500/50" />
                              </div>

                              <h3 className="font-display text-2xl md:text-3xl mb-3">
                                The Ink Washes Off. The Names Don't.
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

            {/* Sidebar */}
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
                      <span className="text-white font-medium">6 / 6</span>
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

        {/* More Chronicles Section */}
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

              <Link
                to="/chronicle/the-department-of-imperial-efficiency"
                className="bg-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-wider">CHRONICLE IV</span>
                </div>
                <h3 className="font-display text-xl text-white group-hover:text-amber-400 transition-colors">
                  The Department of Imperial Efficiency
                </h3>
                <p className="text-stone-400 text-sm mt-2">
                  Elonius arrives. The Aqueduct Guild trembles.
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
