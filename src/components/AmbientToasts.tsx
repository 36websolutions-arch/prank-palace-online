import { useEffect } from "react";
import { Swords, Flame, Shield, Crown, Scroll } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Ambient Rome-themed messages that pop up periodically
const AMBIENT_MESSAGES = [
  { title: "A gladiator has fallen in your honor", description: "The Colosseum roars with approval", icon: Swords },
  { title: "The Senate acknowledges your presence", description: "Your scroll reaches new provinces", icon: Shield },
  { title: "The lions pause mid-feast", description: "Even they recognize greatness", icon: Flame },
  { title: "A centurion dropped his shield laughing", description: "Morale in the barracks is up 200%", icon: Swords },
  { title: "The Emperor's grape-feeder paused", description: "Unprecedented engagement metrics", icon: Crown },
  { title: "Felix would have loved this", description: "We still miss him at the Forum", icon: Flame },
  { title: "The scribes are documenting this", description: "Your presence has been noted", icon: Scroll },
  { title: "Consul Meridius cracked a smile", description: "His teeth blinded three servants", icon: Crown },
  { title: "The Forum erupts in applause", description: "Attendance was mandatory anyway", icon: Shield },
  { title: "Marcus survived another quarter", description: "Adequacy remains the highest praise", icon: Scroll },
  { title: "Brutus shared this with HR", description: "The Praetorian Guard is intrigued", icon: Shield },
  { title: "A new scroll trends in the Forum", description: "Even the Senators are reading it", icon: Scroll },
  { title: "The Oracle speaks well of you", description: "Your denarii forecast looks strong", icon: Crown },
  { title: "The aqueducts flow with engagement", description: "Three guys and a hose confirmed", icon: Flame },
];

// Track which messages have been shown to avoid repeats
let shownIndices: number[] = [];

function getRandomMessage() {
  if (shownIndices.length >= AMBIENT_MESSAGES.length) {
    shownIndices = [];
  }

  let index: number;
  do {
    index = Math.floor(Math.random() * AMBIENT_MESSAGES.length);
  } while (shownIndices.includes(index));

  shownIndices.push(index);
  return AMBIENT_MESSAGES[index];
}

export function AmbientToasts() {
  useEffect(() => {
    // Only run on desktop (screen width > 768px)
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) return;

    const interval = setInterval(() => {
      // Re-check in case window was resized
      if (window.innerWidth < 768) return;

      const msg = getRandomMessage();
      const IconComponent = msg.icon;

      toast({
        title: msg.title,
        description: msg.description,
        variant: "roman" as any,
        icon: <IconComponent className="h-5 w-5 text-amber-500" />,
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
