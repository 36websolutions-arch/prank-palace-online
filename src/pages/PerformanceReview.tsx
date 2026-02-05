import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LikeButton } from "@/components/LikeButton";
import { supabase } from "@/integrations/supabase/client";
import {
  Scroll,
  ArrowLeft,
  Heart,
  Share2,
  ShoppingBag,
  Instagram,
  BookOpen,
  Clock,
  Unlock,
  Shield,
  Award,
  Swords
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | null;
  type: string;
  description: string | null;
}

// The full story content
const STORY_TITLE = "The Performance Review";
const STORY_SUBTITLE = "A Chronicle from the Corporate Empire";

const STORY_PREVIEW = `Marcus had survived twelve quarters.

In the arena, they called him Marcellus the Adequate — not because he was merely adequate, but because adequacy was the highest praise the Senate would allow. To call a gladiator "exceptional" was to invite his execution. Exceptional men became threats. Adequate men became assets.

This particular morning, Marcus stood before his provincial manager, a man named Gaius who had never held a sword in his life but somehow determined who deserved to hold one. Gaius was reviewing a scroll — the incident report.

"You understand why you're here," Gaius said. It wasn't a question.

Marcus understood. Everyone in Rome understood. The whole city was still talking about it.

"The Gratitude Incident," Gaius continued, reading from the scroll. "During the Festival of Saturn games, in front of forty thousand citizens and the entire Senate, you delivered an... unauthorized speech."

Marcus said nothing.

"Would you like to explain yourself?"

"I was expressing gratitude."

Gaius's eye twitched. "You thanked Senator Crassus for—" he checked the scroll "—'generously allowing gladiators to die for his entertainment while he eats grapes that cost more than our yearly wages.'"

"I was being sincere."

"You thanked the Senate for 'providing such excellent working conditions that only six gladiators died of infection this quarter instead of the usual twelve.'"

"That's a fifty percent improvement. I thought leadership would want to celebrate wins."

"You thanked the crowd for 'showing up to watch poor men kill each other so they can forget that they, too, are one bad harvest away from the arena themselves.'"

Marcus remained still. "The crowd laughed."

"THE CROWD WASN'T SUPPOSED TO LAUGH."

Gaius's composure cracked. He set down the scroll. For the first time since Marcus had known him, the manager looked genuinely disturbed.

"Do you understand what you did? You made them see it. For thirty seconds, forty thousand Romans looked at the Senate box and thought: these men are ridiculous. For thirty seconds, the whole system looked like what it is."

Marcus met his eyes. "A joke?"`;

const STORY_FULL = `Marcus had survived twelve quarters.

In the arena, they called him Marcellus the Adequate — not because he was merely adequate, but because adequacy was the highest praise the Senate would allow. To call a gladiator "exceptional" was to invite his execution. Exceptional men became threats. Adequate men became assets.

This particular morning, Marcus stood before his provincial manager, a man named Gaius who had never held a sword in his life but somehow determined who deserved to hold one. Gaius was reviewing a scroll — the incident report.

"You understand why you're here," Gaius said. It wasn't a question.

Marcus understood. Everyone in Rome understood. The whole city was still talking about it.

"The Gratitude Incident," Gaius continued, reading from the scroll. "During the Festival of Saturn games, in front of forty thousand citizens and the entire Senate, you delivered an... unauthorized speech."

Marcus said nothing.

"Would you like to explain yourself?"

"I was expressing gratitude."

Gaius's eye twitched. "You thanked Senator Crassus for—" he checked the scroll "—'generously allowing gladiators to die for his entertainment while he eats grapes that cost more than our yearly wages.'"

"I was being sincere."

"You thanked the Senate for 'providing such excellent working conditions that only six gladiators died of infection this quarter instead of the usual twelve.'"

"That's a fifty percent improvement. I thought leadership would want to celebrate wins."

"You thanked the crowd for 'showing up to watch poor men kill each other so they can forget that they, too, are one bad harvest away from the arena themselves.'"

Marcus remained still. "The crowd laughed."

"THE CROWD WASN'T SUPPOSED TO LAUGH."

Gaius's composure cracked. He set down the scroll. For the first time since Marcus had known him, the manager looked genuinely disturbed.

"Do you understand what you did? You made them see it. For thirty seconds, forty thousand Romans looked at the Senate box and thought: these men are ridiculous. For thirty seconds, the whole system looked like what it is."

Marcus met his eyes. "A joke?"

---

Gaius leaned back. The anger faded into something worse — exhaustion. The expression of a man who had seen this before.

"You're not the first clever one, Marcus. Every few years, someone figures out that if you use their own language against them, they can't punish you without admitting what they really are." He gestured at the scroll. "Every word you said was technically aligned with company values. 'Gratitude.' 'Recognition.' 'Celebrating wins.' I've seen the training materials. You quoted them exactly."

"I'm a quick learner."

"You made Senator Crassus's son cry. He's seven. He asked his father why the funny man said they were bad people."

Marcus felt nothing.

"The boy will inherit six thousand slaves," he said. "He should start learning early."

Gaius was quiet for a long moment. Then he picked up his stylus and began writing.

"I'm marking this as 'needs improvement in stakeholder communication,'" he said. "You'll receive a formal PIP — a Performance Improvement Parchment. You'll have sixty days to demonstrate alignment with Senate values."

"And if I don't?"

"The lions are hungry. They're always hungry. And unlike the crowd, they don't have a sense of humor."

Gaius finished writing and stamped the scroll with the Senate seal. The same seal on every arena, every slave galley, every document that determined who lived and who died.

"For what it's worth," Gaius said quietly, "I laughed too. Everyone in the management box laughed. We just had to pretend we were coughing."

He handed Marcus the scroll.

"Don't do it again. The system survives because everyone agrees to pretend it isn't absurd. The moment people stop pretending—" He didn't finish.

---

THE PARALLEL

Two thousand years later, someone in your office sent a company-wide email "thanking leadership" for the pizza party held the same week as layoffs.

The email was technically positive. Every word aligned with company values. It praised the "thoughtful gesture" and "strong culture of recognition." It thanked the CEO by name for "prioritizing morale during this difficult transition."

Everyone knew what it really meant.

HR couldn't do anything. The words were correct. The sentiment was devastating. For thirty seconds, a thousand employees looked at leadership and thought: these people are ridiculous.

The email was deleted within an hour. The employee was "managed out" within the quarter — officially for "performance issues," unofficially for the crime of making the mask slip.

But screenshots spread. People laughed in private. The company's Glassdoor rating dropped two points.

The system survived, of course. It always survives. But for one moment, someone used their own language against them. Someone proved that the handbook, the values, the "we're all family here" — it was always a script. And scripts can be performed incorrectly on purpose.

Marcus was killed in his fourteenth quarter. Not by lions — the Senate wasn't stupid enough to make a martyr. They simply stopped scheduling his fights. Stopped renewing his contract. Let him fade into poverty until disease took him like it takes all former gladiators.

His file was marked "Voluntary Separation."

The Gratitude Speech was never officially recorded. But for years afterward, gladiators would whisper his words to each other before entering the arena. A small rebellion. A private joke.

The system called it "a cultural alignment issue."

The gladiators called it the only real thing that ever happened in the Colosseum.

---

Your company has values on the wall. Your manager has never done your job. Your performance review will determine your survival, and the metrics will change next quarter to ensure you never quite succeed.

But here's what Rome never figured out, and neither has corporate America:

The system requires your participation in the lie.

And participation is a choice.

---

The Corporate Chronicle
Satire Since Rome`;

export default function PerformanceReview() {
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
    // TODO: Integrate with email service
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
                  <span className="text-amber-400 font-bold tracking-wider text-sm">CHRONICLE I</span>
                </div>
              </div>

              {/* Laurel wreath decoration */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl opacity-60">🏛️</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <Award className="h-8 w-8 text-amber-500" />
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
                  January XXX, MMXXVI
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-2">
                  <Swords className="h-4 w-4" />
                  Arena Tales
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
                      <LikeButton chronicleId="the-performance-review" />
                      <Button variant="ghost" size="sm" className="gap-2 text-stone-600 dark:text-stone-400">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider">
                      Scroll I of III
                    </div>
                  </div>

                  {/* Story Text */}
                  <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
                    {showFullStory ? (
                      // Full story with unlocked badge
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
                      // Preview with gate
                      <>
                        <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                          {STORY_PREVIEW}
                        </div>

                        {/* Content Gate */}
                        <div className="relative mt-12">
                          {/* Fade overlay */}
                          <div className="absolute -top-32 left-0 right-0 h-32 bg-gradient-to-t from-stone-50 dark:from-stone-900 to-transparent pointer-events-none" />

                          {/* Gate CTA - Roman styled */}
                          <div
                            className="relative overflow-hidden rounded-xl text-white animate-[breathe_4s_ease-in-out_infinite]"
                            style={{
                              background: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
                              boxShadow: '0 0 60px rgba(217, 119, 6, 0.4), 0 0 100px rgba(217, 119, 6, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                            }}
                          >
                            {/* Shimmer effect */}
                            <div
                              className="absolute inset-0 animate-[shimmer_3s_ease-in-out_infinite]"
                              style={{
                                background: 'linear-gradient(110deg, transparent 20%, rgba(217,119,6,0.15) 50%, transparent 80%)',
                                backgroundSize: '200% 100%',
                              }}
                            />

                            {/* Glowing border */}
                            <div className="absolute inset-0 rounded-xl border-2 border-amber-500/60 animate-pulse" />

                            {/* Top decorative bar */}
                            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

                            {/* Content */}
                            <div className="relative z-10 p-8 md:p-10 text-center">
                              {/* Unlock icon with animation */}
                              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-500/50 mb-6 animate-[bounce_3s_ease-in-out_infinite]">
                                <Unlock className="h-10 w-10 text-amber-400" />
                              </div>

                              <div className="flex items-center justify-center gap-2 mb-4">
                                <div className="h-px w-8 bg-amber-500/50" />
                                <Swords className="h-5 w-5 text-amber-500" />
                                <div className="h-px w-8 bg-amber-500/50" />
                              </div>

                              <h3 className="font-display text-2xl md:text-3xl mb-3">
                                What Marcus Said Next Got Him Killed.
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

                            {/* Bottom decorative bar */}
                            <div className="h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Decorative bottom border */}
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
                      <span className="text-white font-medium">1 / 3</span>
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
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-semibold">
                    Support the Chronicle
                  </Button>
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

              <Link
                to="/chronicle/the-return-to-office"
                className="bg-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-wider">CHRONICLE III</span>
                </div>
                <h3 className="font-display text-xl text-white group-hover:text-amber-400 transition-colors">
                  The Return to Office
                </h3>
                <p className="text-stone-400 text-sm mt-2">
                  The Forum is our home. You are just visiting.
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
