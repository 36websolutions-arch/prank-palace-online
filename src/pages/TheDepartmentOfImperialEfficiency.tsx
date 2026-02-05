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
    Users,
    Megaphone,
    TrendingDown,
    Scissors
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
const STORY_TITLE = "The Department of Imperial Efficiency";
const STORY_SUBTITLE = "The Merchant Elonius Arrives in Rome";

const STORY_PREVIEW = `The Senate had always been inefficient. It was, in fact, the only thing they were efficient at.

But today, the marble halls were buzzing with a terrified energy. The Emperor had appointed a new High Consul to oversee the treasury: The Merchant Elonius.

Elonius was not from Rome. He came from the distant lands of "Teslaria," where he had made a fortune selling self-driving chariots that occasionally drove themselves into the Rubicon. He arrived at the Forum not in a litter carried by slaves, but on a metal rocket he claimed would one day take the Empire to Mars (the planet, not the god, though he seemed confused about the difference).

Beside him stood his deputy, Vivek the Gaul, a man who spoke so fast that the scribes had to work in shifts just to catch his verbs.

"Citizens!" Elonius announced, standing on a podium he had purchased and renamed 'X'. "The Empire is broke. We are spending too much on bread and not enough on circuses. The Department of Imperial Efficiency (D.O.G.E) is here to fix it."

"Doge?" whispered Senator Claudius. "Like the Venetian Magistrate?"

"No," hissed Brutus. "Like the meme on the coin."

Elonius pointed a finger at the Department of Aqueducts. "You! How many slaves does it take to maintain the flow of water?"

"Five thousand, my lord," the unsuspecting prefect replied.

"Fired," Elonius said. "We can do it with three guys and a very long hose. Next!"

The crowd gasped. You couldn't just fire the Aqueduct Guild. They had a union. They had tenure. They had the wrench.

"But sir," Vivek the Gaul interjected, checking a scroll that was just a list of things he hated. "The Education Ministry? Why are we teaching Greek? Nobody speaks Greek in the future. Cut it."

"Gone," Elonius agreed. "From now on, we only teach Applied Gladiator Combat and Crypto-Denarii trading."`;

const STORY_FULL = `The Senate had always been inefficient. It was, in fact, the only thing they were efficient at.

But today, the marble halls were buzzing with a terrified energy. The Emperor had appointed a new High Consul to oversee the treasury: The Merchant Elonius.

Elonius was not from Rome. He came from the distant lands of "Teslaria," where he had made a fortune selling self-driving chariots that occasionally drove themselves into the Rubicon. He arrived at the Forum not in a litter carried by slaves, but on a metal rocket he claimed would one day take the Empire to Mars (the planet, not the god, though he seemed confused about the difference).

Beside him stood his deputy, Vivek the Gaul, a man who spoke so fast that the scribes had to work in shifts just to catch his verbs.

"Citizens!" Elonius announced, standing on a podium he had purchased and renamed 'X'. "The Empire is broke. We are spending too much on bread and not enough on circuses. The Department of Imperial Efficiency (D.O.G.E) is here to fix it."

"Doge?" whispered Senator Claudius. "Like the Venetian Magistrate?"

"No," hissed Brutus. "Like the meme on the coin."

Elonius pointed a finger at the Department of Aqueducts. "You! How many slaves does it take to maintain the flow of water?"

"Five thousand, my lord," the unsuspecting prefect replied.

"Fired," Elonius said. "We can do it with three guys and a very long hose. Next!"

The crowd gasped. You couldn't just fire the Aqueduct Guild. They had a union. They had tenure. They had the wrench.

"But sir," Vivek the Gaul interjected, checking a scroll that was just a list of things he hated. "The Education Ministry? Why are we teaching Greek? Nobody speaks Greek in the future. Cut it."

"Gone," Elonius agreed. "From now on, we only teach Applied Gladiator Combat and Crypto-Denarii trading."

---

The efficiency measures began immediately.

The Praetorian Guard was replaced by a "Community Note" system where citizens could just vote on whether a crime had occurred. If the ratio was bad, you went to jail.

The postal service was disbanded because "nobody sends letters, they just send DMs."

But the biggest change was to the Senate itself. Elonius introduced a new policy: If a Senator didn't pass at least three laws a week, they would be "optimized."

"Optimized?" asked a trembling junior Senator.

"Sent to the lions," Elonius clarified, checking his phone (which he had invented, despite electricity not existing yet). "But don't worry. It's 'Hardcore' lions. They haven't been fed in a week. Very efficient."

Productivity skyrocketed. Mostly because everyone was writing laws like "The Sky Is Blue Act" and "Water Is Wet Decree" just to stay alive.

"This is madness," Cassius whispered to Felix (who had somehow returned from the void, rebranded as an 'Independent Contractor'). "The Empire is functioning, but at what cost?"

"Cost?" Felix laughed nervously. "Costs are down 80%! Elonius says we'll be profitable by Q3!"

"We're an Empire, not a startup! We don't make profits, we make history!"

"History is expensive," Elonius's voice boomed from a drone hovering overhead. "We're pivoting to Content."

---

THE PARALLEL

Two thousand years later, the "Department of Government Efficiency" announces their first findings.

They suggest replacing the Department of Education with a subscription to ChatGPT.

They propose that the FBI be run by a DAO (Decentralized Autonomous Organization) where 4chan users decide who gets investigated.

They realize that 40% of the federal budget goes to "Legacy Systems," which turns out to be just paying for the password recovery on a mainframe from 1982.

Your CEO watches the news and gets ideas.

"Why do we need a HR department?" he asks in the Monday morning standup. "Can't we just have an AI that auto-rejects vacation requests?"

"We already have that, sir," you remind him. "It's called 'Company Culture'."

"Good. Efficient." He nods. "I'm appointing myself the Czar of Efficiency. My first act is to eliminate all meetings."

A cheer goes up from the engineering team.

"...except for my meetings," he adds. "which will now be 4 hours long and mandatory."

You look at your stock options. They are worth exactly three copper coins.

You look at the news. Elonius is building a starship to escape the budget cuts he created.

You open LinkedIn. "Looking for opportunities in specialized gladiator combat," you type.

It's going to be a long quarter.

---

The Efficiency Update
Satire Since Rome`;

export default function TheDepartmentOfImperialEfficiency() {
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
        alert("Ave, Citizen! Your efficiency score has increased by 0.01%.");
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
                                <div className="flex items-center gap-1 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-full">
                                    <Scissors className="h-4 w-4 text-red-400" />
                                    <span className="text-red-400 font-bold tracking-wider text-sm">CHRONICLE IV</span>
                                </div>
                            </div>

                            {/* Laurel wreath decoration */}
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <span className="text-3xl opacity-60">✂️</span>
                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                                <TrendingDown className="h-8 w-8 text-red-500" />
                                <div className="h-px w-16 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                                <span className="text-3xl opacity-60">✂️</span>
                            </div>

                            <h1 className="font-display text-4xl md:text-6xl mb-4 tracking-tight">
                                {STORY_TITLE}
                            </h1>

                            <p className="text-xl text-red-400 font-serif italic mb-6">
                                {STORY_SUBTITLE}
                            </p>

                            {/* Story meta */}
                            <div className="flex items-center justify-center gap-6 text-stone-400 text-sm">
                                <span className="flex items-center gap-2">
                                    <Scroll className="h-4 w-4" />
                                    February 2, MMXXVI
                                </span>
                                <span className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {readTime} min read
                                </span>
                                <span className="flex items-center gap-2">
                                    <Megaphone className="h-4 w-4" />
                                    D.O.G.E Update
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bottom border decoration */}
                    <div className="h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
                </header>

                {/* Main Content Area */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Story Content */}
                        <article className="lg:col-span-2">
                            {/* Parchment-style story container */}
                            <div className="bg-stone-50 dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 overflow-hidden">
                                {/* Decorative top border */}
                                <div className="h-3 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

                                <div className="p-8 md:p-12">
                                    {/* Social sharing */}
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-stone-200 dark:border-stone-700">
                                        <div className="flex items-center gap-3">
                                            <LikeButton chronicleId="the-department-of-imperial-efficiency" />
                                            <ShareButton title="The Department of Imperial Efficiency" />
                                        </div>
                                        <div className="text-xs text-stone-400 uppercase tracking-wider">
                                            Scroll I of IV
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
                                                            boxShadow: '0 0 60px rgba(220, 38, 38, 0.4), 0 0 100px rgba(220, 38, 38, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
                                                        }}
                                                    >
                                                        {/* Shimmer effect */}
                                                        <div
                                                            className="absolute inset-0 animate-[shimmer_3s_ease-in-out_infinite]"
                                                            style={{
                                                                background: 'linear-gradient(110deg, transparent 20%, rgba(220,38,38,0.15) 50%, transparent 80%)',
                                                                backgroundSize: '200% 100%',
                                                            }}
                                                        />

                                                        {/* Glowing border */}
                                                        <div className="absolute inset-0 rounded-xl border-2 border-red-500/60 animate-pulse" />

                                                        {/* Top decorative bar */}
                                                        <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />

                                                        {/* Content */}
                                                        <div className="relative z-10 p-8 md:p-10 text-center">
                                                            {/* Unlock icon with animation */}
                                                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500/30 to-red-600/10 border-2 border-red-500/50 mb-6 animate-[bounce_3s_ease-in-out_infinite]">
                                                                <Unlock className="h-10 w-10 text-red-400" />
                                                            </div>

                                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                                <div className="h-px w-8 bg-red-500/50" />
                                                                <Scissors className="h-5 w-5 text-red-500" />
                                                                <div className="h-px w-8 bg-red-500/50" />
                                                            </div>

                                                            <h3 className="font-display text-2xl md:text-3xl mb-3">
                                                                See Who Else Was Optimized
                                                            </h3>
                                                            <p className="text-stone-300 mb-8 max-w-md mx-auto">
                                                                Enter your email to confirm you are not a legacy system.
                                                            </p>

                                                            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
                                                                <Input
                                                                    type="email"
                                                                    placeholder="citizen@empire.com"
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                    required
                                                                    className="flex-1 h-14 bg-white/10 border-2 border-red-500/40 text-white placeholder:text-stone-400 text-lg focus:border-red-400 focus:ring-red-400/50 rounded-lg"
                                                                />
                                                                <Button
                                                                    type="submit"
                                                                    className="h-14 px-8 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white font-bold text-lg gap-2 transition-all hover:scale-105 rounded-lg shadow-lg shadow-red-500/25"
                                                                >
                                                                    <Unlock className="h-5 w-5" />
                                                                    Unlock
                                                                </Button>
                                                            </form>

                                                            <button
                                                                onClick={() => setShowFullStory(true)}
                                                                className="text-stone-500 hover:text-stone-300 text-sm transition-colors"
                                                            >
                                                                Continue as Guest (Incurs a 10% laziness tax)
                                                            </button>
                                                        </div>

                                                        {/* Bottom decorative bar */}
                                                        <div className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Decorative bottom border */}
                                <div className="h-3 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />
                            </div>

                            {/* Post-story CTA */}
                            {showFullStory && (
                                <div className="mt-8 p-8 bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl border border-stone-700 text-white">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        <div className="flex-shrink-0">
                                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <Award className="h-8 w-8 text-red-400" />
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="font-display text-xl mb-2">
                                                Optimization Complete
                                            </h3>
                                            <p className="text-stone-400">
                                                Follow @corporatepranks for more efficiency updates from the Empire.
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
                                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                            <Shield className="h-6 w-6 text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-stone-400 uppercase tracking-wider">Your Rank</p>
                                            <p className="font-display text-lg text-red-400">Expendable</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-stone-400">Efficiency Score</span>
                                            <span className="text-white font-medium">84%</span>
                                        </div>
                                        <div className="h-2 bg-stone-700 rounded-full overflow-hidden">
                                            <div className="h-full w-[84%] bg-gradient-to-r from-red-500 to-amber-400 rounded-full" />
                                        </div>
                                        <p className="text-xs text-stone-500">Increase score to avoid optimization</p>
                                    </div>
                                </div>

                                {/* Support CTA */}
                                <div className="bg-white dark:bg-stone-900 rounded-xl p-6 border border-stone-200 dark:border-stone-700">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Heart className="h-5 w-5 text-red-500" />
                                        <h3 className="font-display text-lg text-stone-900 dark:text-stone-100">Bribe the Senate</h3>
                                    </div>
                                    <p className="text-stone-500 dark:text-stone-400 text-sm mb-4">
                                        Or support independent satire. Your choice.
                                    </p>
                                    <Link to="/support">
                                        <Button className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold">
                                            Donate
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
                                    Attendance was mandatory. Enthusiasm was expected.
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
