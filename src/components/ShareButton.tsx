import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  text?: string;
}

export function ShareButton({ title, text }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href;
    const shareText = text || `${title} - A Chronicle from the Corporate Empire`;

    // Use native Web Share API if available (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
        return;
      } catch (err) {
        // User cancelled or share failed - fall through to clipboard
        if ((err as DOMException).name === "AbortError") return;
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied to clipboard",
        description: "Spread the word through the provinces",
        variant: "roman",
      });
    } catch {
      toast({
        title: "Could not copy link",
        description: "Try copying the URL manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="gap-2 text-stone-600 dark:text-stone-400"
    >
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
}
