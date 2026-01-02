import logo from "@/assets/logo.png";
import { Sparkles, Clock, PartyPopper } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary joker-pattern p-4">
      <div className="w-full max-w-lg text-center">
        <img
          src={logo}
          alt="Corporate Pranks"
          className="w-24 h-24 rounded-full object-cover mx-auto mb-6 animate-gentle-float"
        />

        <div className="bg-card rounded-2xl shadow-card p-8 border space-y-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Sparkles className="h-6 w-6" />
            <Clock className="h-8 w-8" />
            <PartyPopper className="h-6 w-6" />
          </div>

          <h1 className="font-display text-4xl text-primary">Coming Soon!</h1>

          <p className="text-muted-foreground text-lg">
            We're cooking up some hilarious mischief behind the scenes. Get
            ready for the ultimate corporate prank experience!
          </p>

          <div className="bg-secondary/50 rounded-xl p-4 border border-primary/20">
            <p className="text-sm text-foreground">
              🎭 You're on the list! We'll notify you when we launch with
              exclusive pranks and surprises.
            </p>
          </div>

          <p className="text-muted-foreground text-sm italic">
            "Good things come to those who wait... and plot mischief." 😈
          </p>
        </div>
      </div>
    </div>
  );
}
