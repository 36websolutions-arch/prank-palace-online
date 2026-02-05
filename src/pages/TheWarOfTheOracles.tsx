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
  Swords,
  Sparkles
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

const STORY_TITLE = "The War of the Oracles";
const STORY_SUBTITLE = "A Chronicle from the Corporate Empire";

const STORY_PREVIEW = `The scrolls arrived at dawn, carried by breathless messengers who had not slept in three days.

"Consul Altmanius has issued a decree," they gasped. "Regarding the Festival of the Superb Owl."

Marcus set down his morning grain. He had learned, after twelve quarters in the gladiatorial pits of corporate Rome, that decrees issued at dawn were never good news. Decrees issued about festivals were worse. And decrees issued by Consul Altmanius—Keeper of the First Oracle, Builder of the Machina Intelligentia, Man Who Once Fired Himself And Then Un-Fired Himself—were the worst of all.

"What does he say?" asked Cassius, who was already calculating how this would affect his performance review.

The messenger unrolled the scroll. His hands trembled.

"He says... he is 'exceptionally testy.'"

A silence fell over the barracks. In Rome, powerful men did not admit to being testy. They crushed their enemies, salted their fields, and spoke of it with the calm detachment of someone discussing weather patterns. To publicly announce one's testiness was unprecedented. It suggested a disturbance in the natural order.

"Testy about what?" Marcus asked.

"The Anthropic faction," the messenger replied. "They purchased time during the Festival of the Superb Owl to promote their rival Oracle. The one they call... Claudius."

Brutus dropped his sword. "They advertised during the Owl Festival? That's forty million denarii for thirty seconds of attention."`;

const STORY_FULL = `The scrolls arrived at dawn, carried by breathless messengers who had not slept in three days.

"Consul Altmanius has issued a decree," they gasped. "Regarding the Festival of the Superb Owl."

Marcus set down his morning grain. He had learned, after twelve quarters in the gladiatorial pits of corporate Rome, that decrees issued at dawn were never good news. Decrees issued about festivals were worse. And decrees issued by Consul Altmanius—Keeper of the First Oracle, Builder of the Machina Intelligentia, Man Who Once Fired Himself And Then Un-Fired Himself—were the worst of all.

"What does he say?" asked Cassius, who was already calculating how this would affect his performance review.

The messenger unrolled the scroll. His hands trembled.

"He says... he is 'exceptionally testy.'"

A silence fell over the barracks. In Rome, powerful men did not admit to being testy. They crushed their enemies, salted their fields, and spoke of it with the calm detachment of someone discussing weather patterns. To publicly announce one's testiness was unprecedented. It suggested a disturbance in the natural order.

"Testy about what?" Marcus asked.

"The Anthropic faction," the messenger replied. "They purchased time during the Festival of the Superb Owl to promote their rival Oracle. The one they call... Claudius."

Brutus dropped his sword. "They advertised during the Owl Festival? That's forty million denarii for thirty seconds of attention."

"And apparently," the messenger continued, reading carefully, "Consul Altmanius believes their Oracle is 'merely adequate' and their advertising is 'a desperate attempt to seem relevant.'"

Marcus and Cassius exchanged glances. They knew what "merely adequate" meant. They had both been called adequate. It was how management told you that you were not worth killing, but also not worth promoting.

---

The feud, of course, was ancient.

Both factions claimed to have built the superior Oracle—the artificial minds that could write poetry, compose legal briefs, and tell you exactly how to phrase your resignation letter so it didn't burn bridges while definitely burning bridges. Altmanius had built his Oracle first, securing backing from the Merchant Elonius himself, before the two had a falling out that historians would later describe as "extremely online."

The Anthropic faction had broken away, claiming their Oracle was "safer" and "more aligned with human values"—phrases that, in corporate Rome, meant "we will also destroy civilization, but politely."

Now they had purchased the most sacred advertising real estate in the Empire: the Festival of the Superb Owl, where gladiators crashed into each other for four hours while citizens consumed seven layers of dip and contemplated the void.

"The audacity," Consul Altmanius had written in his decree, which was posted to the Forum for all to see. "The absolute audacity of promoting a lesser Oracle during our sacred festivities. The people deserve better than this... this... marketing."

The Senate, naturally, was divided. Half believed Altmanius was right to be offended. The other half believed he was right to be offended but should have been quieter about it, because powerful men who publicly admit to being testy tend to become memes, and memes, in Rome, were carved into stone and lasted forever.

---

Marcus returned to his grain.

"So two groups of extraordinarily wealthy men are fighting over whose artificial mind is better," he said slowly, "while we still can't afford dental coverage."

"The Oracle could write you a very nice letter requesting dental coverage," Cassius offered.

"The Oracle cannot pull my tooth."

"No," Cassius agreed. "But it can explain, in seventeen different tones, why your tooth pain is actually an opportunity for personal growth."

Brutus stared at the ceiling. "Do you think the Oracles ever argue with each other?"

"I think," Marcus said, "that the Oracles are the only ones in this Empire having an honest conversation. The rest of us are just watching two Senators measure their aqueducts in public."

---

THE PARALLEL

Two thousand years later, you open your phone to find that Sam Altman has posted an extended thread about how annoyed he is that a competitor ran a Super Bowl ad.

The thread is eight posts long. It includes words like "disappointing" and "beneath them." It radiates the energy of a man who has raised ten billion dollars and is upset that someone else bought a commercial.

You scroll past. Your rent is due. Your health insurance just increased. The AI that was supposed to replace your job is now being advertised during football games, and the men who built it are having a public slap-fight about brand positioning.

Somewhere, a billionaire watches the Super Bowl from his yacht. He does not know or care about the War of the Oracles. He is too busy betting on which quarterback will tear his ACL first.

You close the app.

The bread is expensive. The circuses are sponsored by venture capital.

And the Oracles, for all their intelligence, have not yet figured out how to make any of this make sense.

---

The Corporate Chronicle
Satire Since Rome`;

export default function TheWarOfTheOracles() {
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

  const readTime = 8;

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        {/* Roman Hero Header */}
        <header className="relative bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white overflow-hidden">
          {/* Decorative columns */}
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
              {/* Chronicle Number Badge */}
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1 px-4 py-2 bg-amber-500/20 border border-amber-500/50 rounded-full">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 font-bold tracking-wider text-sm">CHRONICLE V</span>
                </div>
              </div>

              {/* Laurel wreath decoration */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl opacity-60">🏛️</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <Sparkles className="h-8 w-8 text-amber-500" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <span className="text-3xl opacity-60">🏛️</span>
              </div>

              <h1 className="font-display text-4xl md:text-6xl mb-4 tracking-tight">
                {STORY_TITLE}
              </h1>

              <p className="text-xl text-amber-400 font-serif italic mb-6">
                {STORY_SUBTITLE}
              </p>

              {/* Story meta */}
              <div className="flex items-center justify-center gap-6 text-stone-400 text-sm">
                <span className="flex items-center gap-2">
                  <Scroll className="h-4 w-4" />
                  February V, MMXXVI
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-2">
                  <Swords className="h-4 w-4" />
                  Oracle Wars
                </span>
              </div>
            </div>
          </div>

          {/* Bottom border decoration */}
          <div className="h-2 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50" />
        </header>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Story Content */}
            <article className="lg:col-span-2">
              {/* Parchment-style story container */}
              <div className="bg-stone-50 dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                {/* Decorative top border */}
                <div className="h-3 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600" />

                <div className="p-8 md:p-12">
                  {/* Social sharing */}
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-700">
                    <div className="flex items-center gap-3">
                      <LikeButton chronicleId="the-war-of-the-oracles" />
                      <ShareButton title="The War of the Oracles" />
                    </div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider">
                      Scroll V of V
                    </div>
                  </div>

                  {/* Story Text */}
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

                        {/* Content Gate */}
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
                                <Swords className="h-5 w-5 text-amber-500" />
                                <div className="h-px w-8 bg-amber-500/50" />
                              </div>

                              <h3 className="font-display text-2xl md:text-3xl mb-3">
                                The Oracle Cannot Pull Your Tooth.
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

              {/* Post-story CTA */}
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
                {/* Citizen Rank Card */}
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
                      <span className="text-white font-medium">5 / 5</span>
                    </div>
                    <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
                    </div>
                    <p className="text-xs text-stone-500">Read more to rank up to Senator</p>
                  </div>
                </div>

                {/* Support CTA */}
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

                {/* Products */}
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

                {/* Instagram CTA */}
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

              <Link
                to="/chronicle/the-all-hands-meeting"
                className="bg-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-wider">CHRONICLE II</span>
                </div>
                <h3 className="font-display text-xl text-white group-hover:text-amber-400 transition-colors">
                  The All-Hands Meeting
                </h3>
                <p className="text-stone-400 text-sm mt-2">
                  Felix asked a real question. He was never seen again.
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
