import { Scroll } from "lucide-react";

export function ChronicleLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        {/* Spinning scroll */}
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center animate-pulse">
          <Scroll className="h-8 w-8 text-amber-600 dark:text-amber-500 animate-bounce" />
        </div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl animate-pulse" />
      </div>

      <p className="font-display text-xl text-stone-600 dark:text-stone-400 animate-pulse">
        Unrolling the scrolls...
      </p>
    </div>
  );
}

export function ChronicleSpinner() {
  return (
    <div className="inline-flex items-center justify-center w-6 h-6">
      <Scroll className="h-5 w-5 text-amber-600 animate-spin" />
    </div>
  );
}

// Backward compatibility exports
export { ChronicleLoader as JokerLoader };
export { ChronicleSpinner as JokerSpinner };
