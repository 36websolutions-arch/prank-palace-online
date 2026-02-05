import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Swords, Flame, Shield, Crown, Scroll } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Rome-themed toast messages for likes with matching icons
const LIKE_TOASTS = [
  { title: "A gladiator has fallen in your honor", description: "The Colosseum roars with approval", icon: Swords },
  { title: "The Senate acknowledges your presence", description: "Your scroll reaches new provinces", icon: Shield },
  { title: "The lions pause mid-feast", description: "Even they recognize greatness", icon: Flame },
  { title: "Marcus stopped his meeting for this", description: "That's how you know it's good", icon: Scroll },
  { title: "Brutus shared this with HR", description: "Bold move, honestly", icon: Shield },
  { title: "This chronicle spreads through the Forum", description: "The people demand more satire", icon: Scroll },
  { title: "A centurion dropped his shield", description: "He was too busy laughing", icon: Swords },
  { title: "The Emperor's grape-feeder paused", description: "Unprecedented engagement", icon: Crown },
  { title: "Felix would have loved this", description: "We still miss him", icon: Flame },
  { title: "The scribes are documenting this", description: "Your engagement has been noted", icon: Scroll },
  { title: "Even Consul Meridius cracked a smile", description: "His teeth blinded three servants", icon: Crown },
  { title: "The Forum erupts in applause", description: "Attendance was mandatory anyway", icon: Shield },
];

// localStorage keys
const STORAGE_PREFIX = "chronicle_likes_";
const getCountKey = (id: string) => `${STORAGE_PREFIX}count_${id}`;
const getLikedKey = (id: string) => `${STORAGE_PREFIX}liked_${id}`;

// Generate a stable random count for a chronicle (seeded by id)
const getInitialCount = (id: string): number => {
  const stored = localStorage.getItem(getCountKey(id));
  if (stored) return parseInt(stored, 10);

  // Generate random 100-200 and store it
  const count = Math.floor(Math.random() * 101) + 100;
  localStorage.setItem(getCountKey(id), count.toString());
  return count;
};

interface LikeButtonProps {
  chronicleId?: string;
}

export function LikeButton({ chronicleId = "default" }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const count = getInitialCount(chronicleId);
    const liked = localStorage.getItem(getLikedKey(chronicleId)) === "true";
    setLikeCount(count);
    setHasLiked(liked);
    setIsLoaded(true);
  }, [chronicleId]);

  const handleLike = () => {
    if (hasLiked) return;

    const newCount = likeCount + 1;
    setLikeCount(newCount);
    setHasLiked(true);

    // Persist to localStorage
    localStorage.setItem(getCountKey(chronicleId), newCount.toString());
    localStorage.setItem(getLikedKey(chronicleId), "true");

    // Pick a random toast message
    const randomToast = LIKE_TOASTS[Math.floor(Math.random() * LIKE_TOASTS.length)];
    const IconComponent = randomToast.icon;

    toast({
      title: randomToast.title,
      description: randomToast.description,
      variant: "roman",
      icon: <IconComponent className="h-5 w-5 text-amber-500" />,
    });
  };

  // Don't render count until loaded to avoid flash of 0
  if (!isLoaded) {
    return (
      <Button variant="ghost" size="sm" className="gap-2 text-stone-600 dark:text-stone-400">
        <Heart className="h-4 w-4" />
        <span className="font-medium">...</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLike}
      className={`gap-2 transition-all ${
        hasLiked
          ? "text-red-500 hover:text-red-600"
          : "text-stone-600 dark:text-stone-400 hover:text-red-500"
      }`}
    >
      <Heart
        className={`h-4 w-4 transition-all ${hasLiked ? "fill-current scale-110" : ""}`}
      />
      <span className="font-medium">{likeCount.toLocaleString()}</span>
    </Button>
  );
}
