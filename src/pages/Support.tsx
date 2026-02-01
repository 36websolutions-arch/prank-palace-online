import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Crown, Coins, Star, Gift, Users, Scroll, ExternalLink } from "lucide-react";

const KOFI_URL = "https://ko-fi.com/corporatepranks";

export default function Support() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-stone-200 dark:border-stone-800 py-16 lg:py-24">
          {/* Parchment texture */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 mb-6">
                <Heart className="h-10 w-10 text-amber-600" />
              </div>

              <h1 className="font-display text-5xl md:text-6xl text-stone-900 dark:text-stone-100 mb-6">
                Fund the Resistance
              </h1>

              <p className="text-xl text-stone-600 dark:text-stone-400 mb-4 font-serif italic">
                "Every denarius helps us keep exposing the absurdity."
              </p>

              <p className="text-stone-500 dark:text-stone-500 max-w-xl mx-auto mb-8">
                The Senate has unlimited resources. We have... you. Your support keeps the satire flowing and the corporate empire trembling.
                If it made you laugh, consider tipping to keep the comedy alive!
              </p>

              <div className="bg-stone-900 dark:bg-stone-800 rounded-lg p-6 max-w-md mx-auto text-white">
                <p className="text-amber-400 font-display text-lg mb-2">This is what keeps us pranking.</p>
                <p className="text-stone-300 text-sm mb-4">
                  You survived another quarter. So did we. Help us survive another one together.
                </p>
                <a href={KOFI_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2">
                    <Heart className="h-5 w-5" />
                    Support on Ko-fi
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Tiers */}
        <section className="py-16 border-b border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100 mb-4">
                Choose Your Tribute
              </h2>
              <p className="text-stone-600 dark:text-stone-400">
                Join the ranks of those who keep the Chronicle alive
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {/* Copper Coin */}
              <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 hover:shadow-lg hover:border-amber-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">Copper Coin</h3>
                    <p className="text-amber-600 font-bold">$3/month</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400 mb-6">
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Early access to chronicles
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Supporter badge
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Our eternal gratitude
                  </li>
                </ul>
                <a href={KOFI_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-orange-300 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20">
                    Contribute
                  </Button>
                </a>
              </div>

              {/* Silver Denarius */}
              <div className="bg-white dark:bg-stone-900 rounded-xl border-2 border-stone-300 dark:border-stone-600 p-6 hover:shadow-lg hover:border-amber-500/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <Coins className="h-6 w-6 text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">Silver Denarius</h3>
                    <p className="text-amber-600 font-bold">$10/month</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400 mb-6">
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    All Copper Coin benefits
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Vote on chronicle topics
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Name in supporter credits
                  </li>
                </ul>
                <a href={KOFI_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full border-slate-300 hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-950/20">
                    Contribute
                  </Button>
                </a>
              </div>

              {/* Gold Aureus */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 rounded-xl border-2 border-amber-400 dark:border-amber-600 p-6 hover:shadow-lg transition-all duration-300 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  Popular
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-200 dark:bg-amber-800/50 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-stone-900 dark:text-stone-100">Gold Aureus</h3>
                    <p className="text-amber-600 font-bold">$25/month</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400 mb-6">
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    All Silver benefits
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Suggest chronicle topics
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    Quarterly exclusive content
                  </li>
                </ul>
                <a href={KOFI_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Contribute
                  </Button>
                </a>
              </div>

              {/* Imperial Patron */}
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-xl border-2 border-amber-500 p-6 hover:shadow-lg transition-all duration-300 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900 text-xs font-bold rounded-full uppercase tracking-wider">
                  Elite
                </div>
                <div className="flex items-center gap-3 mb-4 relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                    <Crown className="h-6 w-6 text-stone-900" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl">Imperial Patron</h3>
                    <p className="text-amber-400 font-bold">$100/month</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-stone-300 mb-6 relative">
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-400" />
                    All Gold benefits
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-400" />
                    Monthly strategy call
                  </li>
                  <li className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-400" />
                    Product discounts
                  </li>
                  <li className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-amber-400" />
                    <span className="font-medium text-amber-300">THE TROJAN HORSE</span>
                  </li>
                </ul>
                <a href={KOFI_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-stone-900 font-bold">
                    Become a Patron
                  </Button>
                </a>
              </div>
            </div>

            {/* Trojan Horse Explainer */}
            <div className="max-w-2xl mx-auto mt-12 bg-stone-100 dark:bg-stone-800/50 rounded-lg p-6 border border-stone-200 dark:border-stone-700">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🐴</div>
                <div>
                  <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 mb-2">
                    What is THE TROJAN HORSE?
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm mb-2">
                    Imperial Patrons receive a mystery package each quarter. You won't know what's inside until it arrives.
                  </p>
                  <p className="text-stone-500 dark:text-stone-500 text-sm italic">
                    "Beware of Greeks bearing gifts... but trust the Senate."
                  </p>
                  <p className="text-stone-500 dark:text-stone-500 text-xs mt-2">
                    Could be merch, exclusive prints, curated prank supplies, or something we haven't thought of yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Citizen Ranks */}
        <section className="py-16 bg-stone-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Users className="h-10 w-10 text-amber-500 mx-auto mb-4" />
              <h2 className="font-display text-3xl mb-4">Citizen Ranks</h2>
              <p className="text-stone-400 max-w-xl mx-auto">
                Your contributions elevate your status in the Empire. Rise through the ranks and gain exclusive privileges.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              <div className="bg-stone-800/50 rounded-lg p-4 text-center border border-stone-700">
                <div className="text-3xl mb-2">👤</div>
                <h3 className="font-display text-lg text-stone-300 mb-1">Plebeian</h3>
                <p className="text-stone-500 text-xs">New visitor</p>
              </div>
              <div className="bg-stone-800/50 rounded-lg p-4 text-center border border-stone-700">
                <div className="text-3xl mb-2">📜</div>
                <h3 className="font-display text-lg text-stone-200 mb-1">Citizen</h3>
                <p className="text-stone-500 text-xs">Email signup</p>
              </div>
              <div className="bg-stone-800/50 rounded-lg p-4 text-center border border-amber-700/50">
                <div className="text-3xl mb-2">🏛️</div>
                <h3 className="font-display text-lg text-amber-400 mb-1">Senator</h3>
                <p className="text-stone-500 text-xs">10 chronicles OR $5</p>
              </div>
              <div className="bg-stone-800/50 rounded-lg p-4 text-center border border-amber-600/50">
                <div className="text-3xl mb-2">⚔️</div>
                <h3 className="font-display text-lg text-amber-300 mb-1">Consul</h3>
                <p className="text-stone-500 text-xs">$25 donation</p>
              </div>
              <div className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 rounded-lg p-4 text-center border border-amber-500">
                <div className="text-3xl mb-2">👑</div>
                <h3 className="font-display text-lg text-amber-400 mb-1">Emperor</h3>
                <p className="text-stone-500 text-xs">$100 donation</p>
              </div>
            </div>
          </div>
        </section>

        {/* One-Time Donation */}
        <section className="py-16 border-b border-stone-200 dark:border-stone-800">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <Scroll className="h-10 w-10 text-amber-600 mx-auto mb-4" />
              <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100 mb-4">
                Prefer a One-Time Tribute?
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-6">
                Not ready for monthly commitment? A single contribution helps just as much. Every coin counts in the fight against corporate absurdity.
              </p>
              <a href={KOFI_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white gap-2">
                  <Heart className="h-5 w-5" />
                  Make a One-Time Donation
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Where the Money Goes */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl text-stone-900 dark:text-stone-100 mb-8 text-center">
                Where Your Denarii Go
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 text-center">
                  <div className="text-4xl mb-3">✍️</div>
                  <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 mb-2">Content Creation</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm">
                    Writing, research, and crafting the chronicles that expose corporate absurdity
                  </p>
                </div>
                <div className="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 text-center">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 mb-2">Art & Design</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm">
                    Visual content, merchandise design, and maintaining the Roman aesthetic
                  </p>
                </div>
                <div className="bg-white dark:bg-stone-900 rounded-lg p-6 border border-stone-200 dark:border-stone-800 text-center">
                  <div className="text-4xl mb-3">🏛️</div>
                  <h3 className="font-display text-lg text-stone-900 dark:text-stone-100 mb-2">Platform & Hosting</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm">
                    Keeping the Chronicle online, fast, and accessible to all citizens
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
