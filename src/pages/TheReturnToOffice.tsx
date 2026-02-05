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
  Building2
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
const STORY_TITLE = "The Return to Office";
const STORY_SUBTITLE = "A Chronicle from the Corporate Empire";

const STORY_PREVIEW = `The horn sounded at the third hour.

Every citizen of Rome knew what it meant: a new decree. Attendance was mandatory. Enthusiasm was expected. Comprehension was optional.

Lucia had not been to the Forum in three years. She had learned to work from the small courtyard behind her apartment, where the sunlight was free and the pigeons never asked for status updates. She had learned to deliver reports by scroll without ever seeing a Senator's face. She had learned that productivity was possible without sandals in the marble.

That was, apparently, a problem.

"We are returning to the Forum," her manager said, unrolling a wax tablet with the Senate seal. "In-person labor is essential to Roman culture."

"My work is done," Lucia said.

"The Senate wants to see the work," her manager replied. "Also, the Senate wants to see you doing it."

He handed her a second tablet. On it was written in ornate lettering: TOGETHER AGAIN. Beneath the slogan was a schedule for "optional" team breakfasts at the sixth hour, followed by mandatory attendance tracking at the gates.

Lucia looked around at her neighbors. Two doors down, Cassius was already muttering about the commute. Across the street, a scribe was calculating the cost of sandals for his entire family. Someone behind her whispered, "Do we still remember how to smile in public?"

The Forum had been remodeled. New marble. New banners. A fresh slogan carved into stone: THE FORUM IS OUR HOME. Lucia stared at it and wondered why the Senate had so many homes.

"They say it is about culture," Cassius said as they joined the line. "Culture is what they call it when they want you to be somewhere that helps them."

"The Senate says the lions miss us," another gladiator added.

"The lions never met us," Lucia said.

They shuffled forward. Centurions checked names against lists. Those who arrived early were given a sticker that read "ON TIME." Those who arrived late were escorted to a side table marked RE-EDUCATION.

Inside, the air was thick with incense and announcements. A Senator stood on a platform with a scroll and a smile that cost more than Lucia's rent.

"Citizens of Rome!" he cried. "We are thrilled to announce our full return to the Forum. We believe in collaboration. We believe in synergy. We believe in the power of being watched."

The crowd applauded because they always did. Lucia clapped because everyone else clapped. The Senator gestured to the marble columns around them.

"These walls are sacred," he said. "These desks are holy. These seating charts were designed to maximize alignment."

Lucia glanced down at her assigned seat. Row 17. Seat 4. It was directly beneath a dripping fountain.

She raised her hand.

"Yes, Citizen?" the Senator asked.

"If the Forum is our home," Lucia said, "do we get to live here? The rent is cheaper."

Laughter rippled through the crowd before the Centurions could stop it. The Senator's smile held.

"What a wonderful question," he said. "I love the energy."

He turned to his scribe. The scribe wrote Lucia's name on a separate list.`;

const STORY_FULL = `The horn sounded at the third hour.

Every citizen of Rome knew what it meant: a new decree. Attendance was mandatory. Enthusiasm was expected. Comprehension was optional.

Lucia had not been to the Forum in three years. She had learned to work from the small courtyard behind her apartment, where the sunlight was free and the pigeons never asked for status updates. She had learned to deliver reports by scroll without ever seeing a Senator's face. She had learned that productivity was possible without sandals in the marble.

That was, apparently, a problem.

"We are returning to the Forum," her manager said, unrolling a wax tablet with the Senate seal. "In-person labor is essential to Roman culture."

"My work is done," Lucia said.

"The Senate wants to see the work," her manager replied. "Also, the Senate wants to see you doing it."

He handed her a second tablet. On it was written in ornate lettering: TOGETHER AGAIN. Beneath the slogan was a schedule for "optional" team breakfasts at the sixth hour, followed by mandatory attendance tracking at the gates.

Lucia looked around at her neighbors. Two doors down, Cassius was already muttering about the commute. Across the street, a scribe was calculating the cost of sandals for his entire family. Someone behind her whispered, "Do we still remember how to smile in public?"

The Forum had been remodeled. New marble. New banners. A fresh slogan carved into stone: THE FORUM IS OUR HOME. Lucia stared at it and wondered why the Senate had so many homes.

"They say it is about culture," Cassius said as they joined the line. "Culture is what they call it when they want you to be somewhere that helps them."

"The Senate says the lions miss us," another gladiator added.

"The lions never met us," Lucia said.

They shuffled forward. Centurions checked names against lists. Those who arrived early were given a sticker that read "ON TIME." Those who arrived late were escorted to a side table marked RE-EDUCATION.

Inside, the air was thick with incense and announcements. A Senator stood on a platform with a scroll and a smile that cost more than Lucia's rent.

"Citizens of Rome!" he cried. "We are thrilled to announce our full return to the Forum. We believe in collaboration. We believe in synergy. We believe in the power of being watched."

The crowd applauded because they always did. Lucia clapped because everyone else clapped. The Senator gestured to the marble columns around them.

"These walls are sacred," he said. "These desks are holy. These seating charts were designed to maximize alignment."

Lucia glanced down at her assigned seat. Row 17. Seat 4. It was directly beneath a dripping fountain.

She raised her hand.

"Yes, Citizen?" the Senator asked.

"If the Forum is our home," Lucia said, "do we get to live here? The rent is cheaper."

Laughter rippled through the crowd before the Centurions could stop it. The Senator's smile held.

"What a wonderful question," he said. "I love the energy."

He turned to his scribe. The scribe wrote Lucia's name on a separate list.

---

The first week back, Lucia learned the new rituals. There was the Morning Procession, where employees walked past the Senate balcony so the Senators could "connect with the people." There was the Midday Alignment, where a bell rang and everyone stood up to reaffirm their commitment to the Forum. There was the Evening Reflection, where managers asked if the day felt "more collaborative than a day at home."

The Forum was louder than Lucia remembered. The acoustics turned every cough into a proclamation. Someone had installed a fountain that sounded like a drowning man. A Centurion walked around with a basket of "focus tokens" that could be exchanged for fifteen minutes of silence in a corner.

"We are experimenting with flexibility," her manager said. "You may work from home on Saturndays."

"We do not work on Saturndays," Lucia said.

He frowned. "That mindset is not aligned with the Senate's vision."

At lunch, Cassius showed her the new decree: DESK RESERVATIONS ARE REQUIRED. He had reserved a seat near a window. The window faced a wall.

"It is for natural light," he said.

Lucia checked her scroll for messages. There were three from her manager. One asked if she had "felt the energy in the Forum." Another asked if she could "pop over" to the Senate wing for a "quick alignment." The third was a survey titled: HOW HAPPY ARE YOU TO BE HOME?

She answered: "Yes."

On the second week, the Senate unveiled the Commuter Stipend. It was a handful of copper coins, handed out by a Centurion with a clipboard. The coins were enough to pay for one quarter of the sandals required by the new dress code.

"We are investing in you," the Senator said.

Lucia looked at the coins. "This is less than my tram fare."

"We call it a nudge," he replied.

The Senate installed banners that read: COLLABORATION IS A CONTACT SPORT. They hosted a celebration where the Emperor appeared via mirrors, praising the "great return." He announced that productivity was "measurably improved" because he could now see the top of everyone's head.

Lucia watched the Emperor's projection flicker and thought about the pigeons in her courtyard. They had never demanded a badge scan.

---

THE PARALLEL

Two thousand years later, your company announces a full return to office. The email is written in warm, human language, even though you know it was approved by Legal.

"We believe in collaboration," it says. "We believe in culture. We believe in the magic of being together."

Your rent has gone up. Your commute has returned. Your manager asks how your "energy" feels now that you can be seen again.

There is a stipend. It pays for one day of parking a month. There are new badges, new seating plans, new "optional" breakfasts that are tracked. There is a survey asking if you feel "more aligned" with the mission.

You click "Agree" because the alternative is a meeting.

The company announces that productivity is up. You know it is not. The KPI is attendance. The metric is compliance. The story is comfort for the people who never left their offices in the first place.

You do the work. You always did. But now you do it with a commute, a badge scan, and a chair that does not belong to you.

The Forum is not your home. It is their home. You are visiting.

---

Lucia survived the return by learning the old tricks. She smiled at the right times, saved her questions for the parts of the meeting that were labeled "open," and found a quiet stairwell where no one could hear her sigh.

Cassius started arriving ten minutes early so he could claim a chair near the wall. He called it "strategic seating optimization."

One morning, Lucia arrived late on purpose. She wanted to see what the re-education table looked like. The Centurion handed her a pamphlet titled: THE VALUE OF PRESENCE.

She took it home and used it to prop up a table.

---

The Corporate Chronicle
Satire Since Rome`;

export default function TheReturnToOffice() {
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

  const readTime = 9;

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
                  <span className="text-amber-400 font-bold tracking-wider text-sm">CHRONICLE III</span>
                </div>
              </div>

              {/* Laurel wreath decoration */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl opacity-60">🏛️</span>
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <Building2 className="h-8 w-8 text-amber-500" />
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
                  February XXX, MMXXVI
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Forum Mandates
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
                      <LikeButton chronicleId="the-return-to-office" />
                      <ShareButton title="The Return to Office" />
                    </div>
                    <div className="text-xs text-stone-400 uppercase tracking-wider">
                      Scroll III of III
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
                                <Building2 className="h-5 w-5 text-amber-500" />
                                <div className="h-px w-8 bg-amber-500/50" />
                              </div>

                              <h3 className="font-display text-2xl md:text-3xl mb-3">
                                The Forum Is Our Home. You Are Just Visiting.
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
                      <span className="text-white font-medium">3 / 3</span>
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
