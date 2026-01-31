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
  Unlock,
  Shield,
  Award,
  Users,
  Megaphone
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
const STORY_TITLE = "The All-Hands Meeting";
const STORY_SUBTITLE = "A Chronicle from the Corporate Empire";

const STORY_PREVIEW = `The horn sounded at the third hour.

Every citizen of Rome knew what it meant: The Senate would address the people. Attendance was mandatory. Enthusiasm was expected. Comprehension was optional.

Cassius shuffled into the forum with three thousand other gladiators, slaves, and freedmen. The marble seats had been arranged in concentric circles — Senators at the center on cushioned benches, middle management on wooden chairs, and the workforce standing at the edges where the acoustics made everything sound like angry bees.

"Can you hear anything?" whispered Brutus, a fellow gladiator who had survived six quarters by mastering the art of looking engaged while thinking about lunch.

"I heard the word 'synergy,'" Cassius replied. "I think it means we're getting new sandals."

"We got new sandals last year."

"Then it probably means we're losing them."

At the center of the forum, Consul Meridius Maximus — Chief Visionary Officer of the Roman Empire — raised his hands for silence. His robes cost more than most families earned in a decade. His teeth had been whitened using ground pearls. His smile had never once reached his eyes.

"Citizens of Rome!" his voice boomed. "What. A. Quarter."

The crowd erupted in applause. Not because they felt applause, but because the last man to not applaud had been fed to the lions during a "culture realignment exercise."

"I stand before you today humbled," Meridius continued, pressing his hand to his chest in the manner of someone who had never experienced humility. "Humbled by your dedication. Humbled by your sacrifice. Humbled by the way you continue to exceed expectations, quarter after quarter, even as those expectations become mathematically impossible."

More applause.

Cassius noticed the scribes at the side of the forum, furiously writing down how many people clapped and for how long. This data would be used in the next round of "voluntary separations."

"Now," Meridius said, his smile widening, "I know there have been some... concerns."`;

const STORY_FULL = `The horn sounded at the third hour.

Every citizen of Rome knew what it meant: The Senate would address the people. Attendance was mandatory. Enthusiasm was expected. Comprehension was optional.

Cassius shuffled into the forum with three thousand other gladiators, slaves, and freedmen. The marble seats had been arranged in concentric circles — Senators at the center on cushioned benches, middle management on wooden chairs, and the workforce standing at the edges where the acoustics made everything sound like angry bees.

"Can you hear anything?" whispered Brutus, a fellow gladiator who had survived six quarters by mastering the art of looking engaged while thinking about lunch.

"I heard the word 'synergy,'" Cassius replied. "I think it means we're getting new sandals."

"We got new sandals last year."

"Then it probably means we're losing them."

At the center of the forum, Consul Meridius Maximus — Chief Visionary Officer of the Roman Empire — raised his hands for silence. His robes cost more than most families earned in a decade. His teeth had been whitened using ground pearls. His smile had never once reached his eyes.

"Citizens of Rome!" his voice boomed. "What. A. Quarter."

The crowd erupted in applause. Not because they felt applause, but because the last man to not applaud had been fed to the lions during a "culture realignment exercise."

"I stand before you today humbled," Meridius continued, pressing his hand to his chest in the manner of someone who had never experienced humility. "Humbled by your dedication. Humbled by your sacrifice. Humbled by the way you continue to exceed expectations, quarter after quarter, even as those expectations become mathematically impossible."

More applause.

Cassius noticed the scribes at the side of the forum, furiously writing down how many people clapped and for how long. This data would be used in the next round of "voluntary separations."

"Now," Meridius said, his smile widening, "I know there have been some... concerns."

---

The word "concerns" rippled through the crowd like poison through wine.

Last quarter, the Senate had announced a "strategic realignment" that resulted in two hundred gladiators being "transitioned to alternative opportunities" — which meant the lions. The quarter before that, they had "optimized the food distribution process" by cutting rations in half while simultaneously releasing a scroll titled "10 Ways to Feel Full on an Empty Stomach (Number 7 Will Amaze You!)."

"I want to address these concerns directly," Meridius continued. "Because here in Rome, we believe in transparency."

He gestured to a massive scroll that two slaves were unrolling behind him. On it was written a single sentence in letters the size of shields:

WE ARE ALL IN THIS TOGETHER.

"As you can see from our updated values statement, we are committed to unity. To collaboration. To the understanding that when Rome wins, we all win."

Cassius did some mental math. Last quarter's conquests had generated approximately four hundred million denarii. The gladiators had received a "gratitude bonus" of three copper coins each — enough to buy half a loaf of bread, if you negotiated aggressively and didn't mind mold.

The Senators, meanwhile, had built seven new villas, purchased a small island in the Aegean, and commissioned solid gold statues of themselves "to boost morale in the forum."

"Now," Meridius said, "I'd like to open the floor for questions. Remember: there are no bad questions, only questions that affect your performance review."

Silence.

Three thousand people stood frozen, each one calculating the risk-reward ratio of speaking versus remaining invisible.

Finally, a hand went up in the back. It belonged to a young slave named Felix, who had only been with the Empire for two quarters and hadn't yet learned that hope was a terminable offense.

"Yes! You there!" Meridius pointed with genuine delight. He loved questions from new employees. They still believed the answers mattered.

Felix's voice cracked slightly. "Consul Maximus, with respect — you mentioned that we're all in this together. But the new aqueduct schedule means some of us are working eighteen-hour days while the Senate just voted to add a third nap period to their official duties. I was wondering if there were plans to... balance things out?"

The silence that followed was so complete that Cassius could hear a Senator three rows away digesting his breakfast peacock.

Meridius's smile never flickered. That was the terrifying part. His expression remained exactly as warm and exactly as empty as before.

"What a fantastic question, Felix. I love the energy. That's exactly the kind of proactive thinking we need." He turned to the crowd. "Let's give Felix a round of applause for his courage!"

The crowd clapped. Felix, who had been expecting either an answer or execution, stood paralyzed by the third option: being praised while being ignored.

"Now, Felix raises an important point about perception," Meridius continued smoothly. "And perception is something we take very seriously. That's why I'm excited to announce our new initiative: 'Senate Shadows!'"

A banner unfurled. It showed a smiling slave standing next to a reclining Senator, both giving thumbs up.

"Starting next quarter, select employees will have the opportunity to shadow a Senator for one full day! You'll see firsthand the tremendous pressure of their responsibilities — the difficult decisions, the long brunches, the exhausting task of choosing which slaves to bring to the summer villa."

"Is... is that supposed to make us feel better?" Brutus whispered.

"I think it's supposed to make us feel something," Cassius replied. "Feeling things is very on-brand this quarter."

---

The meeting continued for another two hours.

There were updates on the new chariot-sharing program (gladiators could now share a single chariot between twelve people, "reducing our carbon hoofprint"). There was a presentation on the renovated break room (a slightly larger rock to sit on had been installed near the weapons storage). There was a mandatory mindfulness exercise led by a Senator who had never once experienced a consequence.

At the ninety-minute mark, Meridius introduced a "surprise guest" — the Emperor himself, appearing via a complicated system of mirrors and slaves holding torches at precise angles.

The Emperor's holographic image flickered above the forum.

"Greetings, citizens," his disembodied voice echoed. "I am speaking to you from my yacht. As you know, I am deeply committed to connecting with the common people, which is why I am recording this message while being fed grapes by hand."

Cassius watched as a slave's arm appeared in the projection, depositing a grape into the imperial mouth.

"I want you to know that I see you. I value you. Each and every one of you is essential to this Empire. Without you, there would be no Rome. There would be no glory. There would be no one to clean the vomitoriums after the festival banquets."

The Emperor paused for what was clearly scripted to be an emotional moment.

"In conclusion: you matter. Your work matters. Now please enjoy this inspirational video about a blind slave who taught himself to read so he could better understand his termination notice."

The projection faded. The crowd applauded. Somewhere in the back, Felix was being escorted away by two Centurions for "a quick chat about forum decorum."

---

THE PARALLEL

Two thousand years later, your CEO addresses the company via Zoom.

He is in his home office, which costs more than most employees' annual salaries. Behind him, carefully curated books about leadership sit on shelves that have never been touched. His audio cuts out every thirty seconds because he refuses to use the provided headset ("not on brand").

"What. A. Quarter," he says.

You look at Slack. Forty people have typed "so true!" The messages appeared within 0.3 seconds of each other, which means everyone had them pre-written.

"I know there have been some concerns about the recent restructuring," the CEO continues. "But I want you to know — we are all in this together."

Behind you, through your shared apartment wall, you can hear your neighbor — who was laid off in the restructuring — crying into his cereal.

The CEO announces a new wellness initiative: fifteen minutes of optional meditation on Fridays, from 5:45 to 6:00 PM, unpaid, attendance tracked.

There is a Q&A session. No one asks questions. The CEO seems disappointed. He likes when people ask questions; it gives him content for his LinkedIn posts about "authentic leadership."

Finally, someone in the chat types: "What's the plan for work-life balance?"

The CEO smiles. "Great question. We're actually rolling out a new program called 'Executive Shadows' where select employees can spend a day seeing how hard the leadership team works."

Someone in the chat types a heart emoji. Someone else types "love this."

You mute yourself and scream into a pillow.

The meeting ends with a video about a warehouse worker who lost his legs in an accident and now "inspires" people by continuing to work from a wheelchair, fourteen hours a day, while management uses his story in recruiting materials.

The CEO reminds everyone that Q3 targets have been increased by 40%.

"We believe in you," he says. "Now let's make it happen."

He logs off. He's late for his trainer.

You sit in silence for a moment. Then you open Slack and type "so inspiring!" because the performance review cycle starts next week.

---

Cassius survived another three quarters.

He learned to applaud at the right moments, to nod when the speeches required nodding, to ask questions that were actually compliments phrased as inquiries. He learned that the secret to survival wasn't talent or hard work — it was the ability to sit through a three-hour meeting about "Optimizing Your Gladiatorial Journey" without visibly dying inside.

Felix was never seen again. His position was listed as "open" for two weeks, then eliminated entirely as part of a "role optimization initiative."

But sometimes, late at night, gladiators would whisper about the day someone asked a real question. The day someone, for just a moment, pretended the forum was actually a place where people could speak.

They called it "The Felix Incident."

Management called it a "learning opportunity."

---

The next all-hands is scheduled for Thursday.

Attendance is mandatory.

Enthusiasm is expected.

Comprehension remains, as always, optional.

---

The Corporate Chronicle
Satire Since Rome`;

export default function TheAllHandsMeeting() {
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

  const readTime = 10;

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
                  <span className="text-amber-400 font-bold tracking-wider text-sm">CHRONICLE II</span>
                </div>
              </div>

              {/* Laurel wreath decoration */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl opacity-60">🏛️</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <Users className="h-8 w-8 text-amber-500" />
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
                  <Megaphone className="h-4 w-4" />
                  Forum Tales
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
                      <Button variant="ghost" size="sm" className="gap-2 text-stone-600 dark:text-stone-400">
                        <Heart className="h-4 w-4" />
                        Salute
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 text-stone-600 dark:text-stone-400">
                        <Share2 className="h-4 w-4" />
                        Share
                      </Button>
                    </div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider">
                      Scroll II of II
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
                                <Users className="h-5 w-5 text-amber-500" />
                                <div className="h-px w-8 bg-amber-500/50" />
                              </div>

                              <h3 className="font-display text-2xl md:text-3xl mb-3">
                                Felix Asked a Real Question. He Was Never Seen Again.
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
                      <span className="text-white font-medium">2 / 2</span>
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
                to="/chronicle/the-performance-review"
                className="bg-stone-800 rounded-xl p-6 border border-stone-700 hover:border-amber-500/50 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-amber-400" />
                  <span className="text-amber-400 text-xs font-bold tracking-wider">CHRONICLE I</span>
                </div>
                <h3 className="font-display text-xl text-white group-hover:text-amber-400 transition-colors">
                  The Performance Review
                </h3>
                <p className="text-stone-400 text-sm mt-2">
                  Marcus expressed gratitude. It did not go well.
                </p>
              </Link>

              <div className="bg-stone-800/50 rounded-xl p-6 border border-stone-700/50 opacity-60">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-stone-500" />
                  <span className="text-stone-500 text-xs font-bold tracking-wider">CHRONICLE III</span>
                </div>
                <h3 className="font-display text-xl text-stone-400">
                  Coming Soon...
                </h3>
                <p className="text-stone-500 text-sm mt-2">
                  More tales from the Corporate Empire
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
