import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
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
  MessageCircle
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
    alert("Welcome to the Senate! Full chronicle unlocked.");
    setEmail("");
  };

  const readTime = 8; // Estimated read time for this story

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        {/* Story Header */}
        <header className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
          <div className="container mx-auto px-4 py-8">
            <Link
              to="/home2"
              className="inline-flex items-center gap-2 text-stone-500 hover:text-amber-600 transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to The Chronicles
            </Link>

            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded-full uppercase tracking-wider">
                  Chronicle
                </span>
                <span className="text-stone-500 text-sm">
                  January 30, 2026
                </span>
                <span className="flex items-center gap-1 text-stone-500 text-sm">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-stone-100 mb-2">
                {STORY_TITLE}
              </h1>
              <p className="text-lg text-stone-500 dark:text-stone-400 font-serif italic">
                {STORY_SUBTITLE}
              </p>

              {/* Social sharing */}
              <div className="flex items-center gap-3 mt-6">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Discuss
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Story Content */}
            <article className="lg:col-span-2">
              {/* Story Text */}
              <div className="prose prose-lg prose-stone dark:prose-invert max-w-none">
                {showFullStory ? (
                  // Full story
                  <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                    {STORY_FULL}
                  </div>
                ) : (
                  // Preview with gate
                  <>
                    <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
                      {STORY_PREVIEW}
                    </div>

                    {/* Content Gate */}
                    <div className="relative mt-8">
                      {/* Fade overlay */}
                      <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-t from-stone-50 dark:from-stone-950 to-transparent pointer-events-none" />

                      {/* Gate CTA */}
                      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-8 text-white text-center">
                        <Scroll className="h-12 w-12 mx-auto mb-4 text-amber-500" />
                        <h3 className="font-display text-2xl mb-2">What Marcus Said Next Got Him Killed.</h3>
                        <p className="text-stone-300 mb-6 max-w-md mx-auto">
                          Join the Senate to unlock the full chronicle. Get new stories delivered to your inbox.
                        </p>

                        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
                          <Input
                            type="email"
                            placeholder="citizen@empire.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 bg-stone-800 border-stone-700 text-white placeholder:text-stone-500"
                          />
                          <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
                            Unlock Story
                          </Button>
                        </form>

                        <button
                          onClick={() => setShowFullStory(true)}
                          className="text-stone-500 hover:text-stone-300 text-sm underline"
                        >
                          Skip for now
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Post-story CTA */}
              {showFullStory && (
                <div className="mt-12 p-8 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900/50">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                      <h3 className="font-display text-xl mb-2 text-stone-900 dark:text-stone-100">
                        Enjoyed this chronicle?
                      </h3>
                      <p className="text-stone-600 dark:text-stone-400">
                        Follow @corporatepranks for daily stories. New parallels between Rome and corporate America every day.
                      </p>
                    </div>
                    <a
                      href="https://www.instagram.com/corporatepranks"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white">
                        <Instagram className="h-5 w-5" />
                        Follow on Instagram
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar - Monetization */}
            <aside className="space-y-6">
              {/* Sticky container */}
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Support CTA */}
                <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-5 w-5 text-red-400" />
                    <h3 className="font-display text-lg">Fund the Resistance</h3>
                  </div>
                  <p className="text-stone-300 text-sm mb-4">
                    Like this story? Help us keep the satire flowing.
                  </p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Support with $5
                  </Button>
                </div>

                {/* Related Products */}
                <div className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-800">
                  <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="h-5 w-5 text-amber-600" />
                    <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">
                      Tools of the Trade
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
                    <Button variant="outline" className="w-full mt-4 border-stone-300 dark:border-stone-700">
                      Browse All
                    </Button>
                  </Link>
                </div>

                {/* Instagram CTA */}
                <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 rounded-xl p-6 text-white text-center">
                  <Instagram className="h-10 w-10 mx-auto mb-3 opacity-90" />
                  <h3 className="font-display text-lg mb-2">Daily Chronicles</h3>
                  <p className="text-white/80 text-sm mb-4">
                    New stories drop daily on Instagram
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

                {/* Ad Space */}
                <div className="bg-stone-100 dark:bg-stone-800/50 rounded-xl p-6 border border-dashed border-stone-300 dark:border-stone-700 text-center">
                  <p className="text-stone-400 text-xs uppercase tracking-wider mb-2">Sponsored</p>
                  <p className="text-stone-500 dark:text-stone-400 text-sm">
                    Advertise here <br />
                    <a href="mailto:hello@corporateprank.com" className="text-amber-600 hover:underline">
                      Get rates
                    </a>
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* More Chronicles Section */}
        <section className="py-16 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="h-6 w-6 text-amber-600" />
              <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100">
                More Chronicles
              </h2>
            </div>

            <div className="text-center py-12">
              <Scroll className="h-16 w-16 text-stone-300 dark:text-stone-700 mx-auto mb-4" />
              <p className="text-stone-500 dark:text-stone-400 mb-4">More chronicles coming soon...</p>
              <Link to="/home2">
                <Button variant="outline">
                  View All Chronicles
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
