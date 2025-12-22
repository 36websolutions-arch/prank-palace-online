export function JokerLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        {/* Spinning card */}
        <div className="joker-spinner flex items-center justify-center text-2xl text-primary-foreground">
          🃏
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl animate-pulse" />
      </div>
      
      <p className="font-display text-xl text-muted-foreground animate-pulse">
        Your prank is loading… 😈
      </p>
    </div>
  );
}

export function JokerSpinner() {
  return (
    <div className="inline-flex items-center justify-center w-6 h-6">
      <span className="animate-spin text-lg">🃏</span>
    </div>
  );
}
