import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import { trackAddToCart } from "@/lib/analytics";
import { ShoppingCart, Lock, Package, Star, ChevronDown, Check, Upload, ZoomIn, ZoomOut, Move } from "lucide-react";
import logo from "@/assets/logo.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface CardOption {
  id: number;
  name: string;
  front: string;
  inside: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────────

const CARD_OPTIONS: CardOption[] = [
  { id: 1, name: "The Official Award", front: "Congratulations!", inside: "You've officially been crowned a DickHead. This custom sculpture is your trophy. Display it proudly." },
  { id: 2, name: "The Honest Friend", front: "I Got You Something.", inside: "It's your face on a golden dick. Because that's how everyone sees you anyway. You're welcome." },
  { id: 3, name: "The Anonymous Tip", front: "FROM: Someone Who Knows", inside: "TO: A Real DickHead. We had your likeness immortalized. It's uncanny." },
  { id: 4, name: "The Performance Review", front: "Your Review Is In.", inside: "Category: DickHead. Rating: 10/10. Evidence: Enclosed. No appeals." },
  { id: 5, name: "The Promotion", front: "You've Been Promoted!", inside: "To Head DickHead. This sculpture is your badge of office. Wear it with shame." },
  { id: 6, name: "The Group Chat", front: "The Group Chat Decided.", inside: "It was unanimous. You are, without question, the biggest DickHead we know. Here's your statue." },
  { id: 7, name: "The Love Letter", front: "I Love You But...", inside: "You're a DickHead. And now there's a sculpture to prove it. Still love you though. Barely." },
  { id: 8, name: "Hall of Fame", front: "HALL OF FAME INDUCTION", inside: "We are proud to induct you into the DickHead Hall of Fame. This sculpture commemorates your lifetime achievement." },
  { id: 9, name: "The Retirement Gift", front: "Happy Retirement!", inside: "After years of dedicated DickHeadery, you've earned this golden monument. May it remind you of your legacy." },
  { id: 10, name: "The Birthday Roast", front: "Happy Birthday!", inside: "Another year older. Still a DickHead. We got your face sculpted onto proof. Make a wish." },
  { id: 11, name: "The Apology", front: "I'm Sorry...", inside: "...that this sculpture is so accurate. Your face really does look perfect on there. It's like it was meant to be." },
  { id: 12, name: "The Simple Truth", front: "No Easy Way to Say This.", inside: "You're a DickHead. Here's the sculpture. We measured twice. It's to scale." },
  { id: 13, name: "Custom Message", front: "", inside: "" },
];

const REVIEWS = [
  { stars: 5, text: "Sent this to my boss after I quit. Best $250 I ever spent. The detail on his face was incredible.", author: "Derek T." },
  { stars: 5, text: "Got this for my husband's birthday. He laughed for 20 minutes then put it on his desk. It's still there.", author: "Monica S." },
  { stars: 5, text: "My fraternity brother's face on a golden dickhead sculpture. He displays it like a trophy. Legendary.", author: "Jason K." },
  { stars: 5, text: "The face preview tool is genius. I could see exactly how stupid my friend would look before I ordered.", author: "Rachel W." },
  { stars: 5, text: "Worth every penny. The 3D printing quality is insane. My coworker was speechless for the first time ever.", author: "Alex M." },
];

const FAQ_ITEMS = [
  {
    q: "How does the face customization work?",
    a: "Upload a clear, front-facing photo. Our artists use advanced 3D modeling to sculpt the face onto the golden sculpture. The preview tool gives you an approximation — the final product is even more detailed and accurate."
  },
  {
    q: "What is the sculpture made of?",
    a: "Each piece is 3D-printed using premium resin and finished with a high-quality metallic gold coating. It's solid, weighty, and looks like a real golden trophy. About 8 inches tall."
  },
  {
    q: "How long does it take to make?",
    a: "Each sculpture is custom-made. Allow 5-7 business days for sculpting and printing, plus 3-5 days for shipping. Rush orders available — contact us."
  },
  {
    q: "Can I ship it anonymously?",
    a: "Absolutely. Select anonymous shipping at checkout. No return address, no sender info. They'll never know who immortalized their face as a DickHead."
  },
  {
    q: "What kind of photo works best?",
    a: "A clear, well-lit, front-facing headshot works best. Good lighting, minimal shadows, no sunglasses. The better the photo, the better the sculpture."
  },
  {
    q: "Is this safe for work display?",
    a: "That depends on your workplace's sense of humor. It's a golden sculpture — it looks premium. Whether your HR department agrees... we can't guarantee."
  },
  {
    q: "What if they don't find it funny?",
    a: "They will. But even if they don't, they now own a custom golden sculpture. That's objectively cool. 30-day satisfaction guarantee if there's a quality issue."
  },
];

// ─── Hooks ──────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

function useAnimatedCounter(target: number, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [target, duration, trigger]);

  return count;
}

// ─── Sub-Components ─────────────────────────────────────────────────────────────

function FadeUp({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function GlowButton({
  children,
  onClick,
  className = "",
  size = "lg",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: "md" | "lg" | "xl";
}) {
  const sizeClasses = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative font-bold uppercase tracking-wider rounded-xl
        bg-gradient-to-r from-amber-500 to-orange-500
        text-white shadow-[0_0_30px_rgba(245,158,11,0.4)]
        hover:shadow-[0_0_50px_rgba(245,158,11,0.6)]
        hover:scale-[1.03] active:scale-[0.98]
        transition-all duration-300
        animate-subtle-pulse
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// ─── Face Upload + Canvas Preview ────────────────────────────────────────────────

function FacePreview({ onFaceData }: { onFaceData: (data: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [faceScale, setFaceScale] = useState(1.0);
  const [faceOffset, setFaceOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOver, setDragOver] = useState(false);

  // Canvas dimensions
  const CANVAS_W = 400;
  const CANVAS_H = 500;
  // Head position — oval area near the top of the "sculpture"
  const HEAD_CX = CANVAS_W / 2;
  const HEAD_CY = 130;
  const HEAD_RX = 70;
  const HEAD_RY = 90;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background
    ctx.fillStyle = "#1c1917";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Draw golden sculpture silhouette
    ctx.save();

    // Shaft/body of sculpture
    const gradient = ctx.createLinearGradient(CANVAS_W / 2 - 50, 160, CANVAS_W / 2 + 50, 160);
    gradient.addColorStop(0, "#8B6914");
    gradient.addColorStop(0.3, "#d4a843");
    gradient.addColorStop(0.5, "#f0c95c");
    gradient.addColorStop(0.7, "#d4a843");
    gradient.addColorStop(1, "#8B6914");

    // Draw body shape
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(CANVAS_W / 2 - 45, 200);
    ctx.quadraticCurveTo(CANVAS_W / 2 - 55, 300, CANVAS_W / 2 - 40, 380);
    ctx.quadraticCurveTo(CANVAS_W / 2 - 30, 420, CANVAS_W / 2, 430);
    ctx.quadraticCurveTo(CANVAS_W / 2 + 30, 420, CANVAS_W / 2 + 40, 380);
    ctx.quadraticCurveTo(CANVAS_W / 2 + 55, 300, CANVAS_W / 2 + 45, 200);
    ctx.closePath();
    ctx.fill();

    // Base/pedestal
    const baseGrad = ctx.createLinearGradient(CANVAS_W / 2 - 70, 430, CANVAS_W / 2 + 70, 430);
    baseGrad.addColorStop(0, "#8B6914");
    baseGrad.addColorStop(0.5, "#f0c95c");
    baseGrad.addColorStop(1, "#8B6914");
    ctx.fillStyle = baseGrad;
    ctx.beginPath();
    ctx.ellipse(CANVAS_W / 2, 440, 70, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.rect(CANVAS_W / 2 - 70, 440, 140, 25);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(CANVAS_W / 2, 465, 70, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head sphere (golden) — draw first, then overlay face
    const headGrad = ctx.createRadialGradient(HEAD_CX - 15, HEAD_CY - 20, 10, HEAD_CX, HEAD_CY, HEAD_RY);
    headGrad.addColorStop(0, "#f5d97a");
    headGrad.addColorStop(0.5, "#d4a843");
    headGrad.addColorStop(1, "#8B6914");
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(HEAD_CX, HEAD_CY, HEAD_RX, HEAD_RY, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Draw uploaded face if available
    if (uploadedImage) {
      ctx.save();

      // Create clipping mask for head area
      ctx.beginPath();
      ctx.ellipse(HEAD_CX, HEAD_CY, HEAD_RX - 4, HEAD_RY - 4, 0, 0, Math.PI * 2);
      ctx.clip();

      // Calculate image dimensions to fill the oval
      const imgAspect = uploadedImage.width / uploadedImage.height;
      const ovalAspect = (HEAD_RX * 2) / (HEAD_RY * 2);
      let drawW: number, drawH: number;

      if (imgAspect > ovalAspect) {
        drawH = HEAD_RY * 2 * faceScale;
        drawW = drawH * imgAspect;
      } else {
        drawW = HEAD_RX * 2 * faceScale;
        drawH = drawW / imgAspect;
      }

      const drawX = HEAD_CX - drawW / 2 + faceOffset.x;
      const drawY = HEAD_CY - drawH / 2 + faceOffset.y;

      ctx.drawImage(uploadedImage, drawX, drawY, drawW, drawH);

      ctx.restore();

      // Overlay a subtle gold tint for blending
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.beginPath();
      ctx.ellipse(HEAD_CX, HEAD_CY, HEAD_RX - 4, HEAD_RY - 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#d4a843";
      ctx.fill();
      ctx.restore();

      // Draw oval border for polish
      ctx.save();
      ctx.strokeStyle = "#d4a84380";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(HEAD_CX, HEAD_CY, HEAD_RX - 2, HEAD_RY - 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Subtle shine overlay on entire sculpture
    ctx.save();
    ctx.globalAlpha = 0.06;
    const shineGrad = ctx.createLinearGradient(CANVAS_W / 2 - 80, 50, CANVAS_W / 2 + 80, 480);
    shineGrad.addColorStop(0, "#ffffff");
    shineGrad.addColorStop(0.3, "transparent");
    shineGrad.addColorStop(0.6, "#ffffff");
    shineGrad.addColorStop(1, "transparent");
    ctx.fillStyle = shineGrad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();

    // Export face data for order
    if (uploadedImage) {
      onFaceData(canvas.toDataURL("image/jpeg", 0.6));
    }
  }, [uploadedImage, faceScale, faceOffset, onFaceData]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        setFaceScale(1.0);
        setFaceOffset({ x: 0, y: 0 });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // Canvas mouse/touch drag for positioning face
  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (!uploadedImage) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - faceOffset.x, y: e.clientY - faceOffset.y });
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setFaceOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleCanvasPointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          dragOver
            ? "border-amber-400 bg-amber-500/10"
            : uploadedImage
              ? "border-green-500/50 bg-green-500/5"
              : "border-stone-700 bg-stone-900/50 hover:border-amber-500/50"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />
        <div className="space-y-3">
          <Upload className={`h-10 w-10 mx-auto ${uploadedImage ? "text-green-400" : "text-amber-500"}`} />
          <div>
            <p className="text-lg font-bold text-white">
              {uploadedImage ? "Face Uploaded! Click to Change" : "Upload Your Victim's Face"}
            </p>
            <p className="text-sm text-stone-400 mt-1">
              {uploadedImage
                ? "Drag the face on the preview to reposition"
                : "Drag & drop or click to upload. Clear, front-facing photo works best."}
            </p>
          </div>
        </div>
      </div>

      {/* Canvas Preview */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative rounded-2xl overflow-hidden border border-stone-800 shadow-[0_0_40px_rgba(212,168,67,0.15)]">
          <canvas
            ref={canvasRef}
            width={CANVAS_W}
            height={CANVAS_H}
            className="w-full max-w-[400px]"
            style={{ touchAction: "none" }}
            onPointerDown={handleCanvasPointerDown}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onPointerLeave={handleCanvasPointerUp}
          />
          {!uploadedImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-950/40 pointer-events-none">
              <p className="text-sm text-stone-400 bg-stone-900/80 px-4 py-2 rounded-lg">
                Upload a photo to see the preview
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        {uploadedImage && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-lg px-3 py-2">
              <ZoomOut className="h-4 w-4 text-stone-400" />
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={faceScale}
                onChange={(e) => setFaceScale(parseFloat(e.target.value))}
                className="w-24 accent-amber-500"
              />
              <ZoomIn className="h-4 w-4 text-stone-400" />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <Move className="h-3.5 w-3.5" />
              Drag to position
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function TheDickHead() {
  usePageMeta({
    title: "The DickHead",
    description: "A custom sculpture of someone's face on a golden dick. Upload their photo. We do the rest. The ultimate power move.",
    image: "/products/the-dickhead/hero-1.webp",
    url: "/the-dickhead",
  });

  const navigate = useNavigate();

  // State
  const [selectedCard, setSelectedCard] = useState<number>(1);
  const [customFront, setCustomFront] = useState("");
  const [customInside, setCustomInside] = useState("");
  const [cardFlipped, setCardFlipped] = useState(false);
  const [heroImage, setHeroImage] = useState(0);
  const [viewingCount, setViewingCount] = useState(12);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [faceImageData, setFaceImageData] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const heroImages = [
    "/products/the-dickhead/hero-1.webp",
    "/products/the-dickhead/hero-2.webp",
    "/products/the-dickhead/hero-3.webp",
  ];

  // Viewing counter randomizer
  useEffect(() => {
    const interval = setInterval(() => {
      setViewingCount(Math.floor(Math.random() * 15) + 8);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Sticky bar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.getBoundingClientRect().bottom;
        setShowStickyBar(heroBottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImage(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Save selections and go straight to checkout (no cart)
  const handleCheckout = () => {
    const card = CARD_OPTIONS.find(c => c.id === selectedCard);

    localStorage.setItem("dickheadOrder", JSON.stringify({
      productName: "The DickHead - Custom 3D Sculpture",
      cardId: selectedCard,
      cardName: card?.name,
      cardFront: selectedCard === 13 ? customFront : card?.front,
      cardInside: selectedCard === 13 ? customInside : card?.inside,
      bundleQty: 1,
      unitPrice: 250,
      totalPrice: 250,
      comparePrice: 399.99,
      image: "/products/the-dickhead/hero-1.webp",
      faceImageData: faceImageData,
    }));

    trackAddToCart("The DickHead - Custom 3D Sculpture", 250);
    navigate("/checkout?from=dickhead");
  };

  const currentCard = CARD_OPTIONS.find(c => c.id === selectedCard)!;

  return (
    <div className="min-h-screen bg-stone-950 text-white overflow-x-hidden">
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.4); }
          50% { box-shadow: 0 0 50px rgba(245,158,11,0.6); }
        }
        .animate-subtle-pulse {
          animation: subtle-pulse 2.5s ease-in-out infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes gold-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-gold-shimmer {
          background-size: 200% auto;
          animation: gold-shimmer 3s linear infinite;
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
        .animate-orb-pulse {
          animation: orb-pulse 6s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* ═══ A. Announcement Bar ═══ */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 text-sm font-bold tracking-wide px-4">
              <span>NEW: CUSTOM 3D-PRINTED SCULPTURES</span>
              <span className="text-amber-800">&#9670;</span>
              <span>THEIR FACE. GOLDEN. LEGENDARY.</span>
              <span className="text-amber-800">&#9670;</span>
              <span>FREE SHIPPING ON EVERY ORDER</span>
              <span className="text-amber-800">&#9670;</span>
              <span>NEW: CUSTOM 3D-PRINTED SCULPTURES</span>
              <span className="text-amber-800">&#9670;</span>
              <span>THEIR FACE. GOLDEN. LEGENDARY.</span>
              <span className="text-amber-800">&#9670;</span>
              <span>FREE SHIPPING ON EVERY ORDER</span>
              <span className="text-amber-800 mr-8">&#9670;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ Minimal Header ═══ */}
      <header className="sticky top-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Corporate Pranks" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-amber-500">CORPORATE</span>
              <span className="text-stone-400"> PRANKS</span>
            </span>
          </Link>
          <Link to="/cart" className="relative p-2 text-stone-400 hover:text-amber-500 transition-colors">
            <ShoppingCart className="h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* ═══ B. Hero Section ═══ */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center py-12 lg:py-20">
        {/* Floating golden orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] animate-orb-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px] animate-orb-pulse" style={{ animationDelay: "3s" }} />
          <div className="absolute top-1/2 right-1/6 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] animate-orb-pulse" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left — Product Image */}
          <FadeUp>
            <div className="relative">
              <div className="animate-float">
                <div className="relative aspect-square max-w-lg mx-auto bg-stone-900 rounded-2xl overflow-hidden border border-stone-800">
                  {heroImages.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`The DickHead sculpture view ${i + 1}`}
                      className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ${
                        i === heroImage ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {/* Image dots */}
              <div className="flex justify-center gap-2 mt-4">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroImage(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i === heroImage ? "bg-amber-500 w-8" : "bg-stone-600 hover:bg-stone-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </FadeUp>

          {/* Right — Product Info */}
          <FadeUp delay={0.2}>
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 text-amber-400 text-sm font-bold">
                <Star className="h-4 w-4 fill-amber-400" />
                CUSTOM 3D-PRINTED SCULPTURE
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[0.95]">
                THE{" "}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent animate-gold-shimmer">
                  DICKHEAD.
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-stone-400 italic font-serif">
                Their face. Sculpted in gold. Mounted for eternity.
              </p>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-white">$250.00</span>
                <span className="text-xl text-stone-500 line-through">$399.99</span>
                <span className="bg-red-500/20 text-red-400 text-sm font-bold px-3 py-1 rounded-full">
                  SAVE $149.99
                </span>
              </div>

              {/* Viewing counter */}
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                </span>
                <span>{viewingCount} people are viewing this right now</span>
              </div>

              {/* Card Message Quick Select */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-stone-300 uppercase tracking-wider">Pick Your Roast Card</label>
                <div className="relative">
                  <select
                    value={selectedCard}
                    onChange={(e) => { setSelectedCard(Number(e.target.value)); setCardFlipped(false); }}
                    className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-3 text-white appearance-none cursor-pointer focus:border-amber-500 focus:outline-none transition-colors"
                  >
                    {CARD_OPTIONS.map(card => (
                      <option key={card.id} value={card.id}>
                        {card.id === 13 ? "Custom Message — Write Your Own" : `${card.name} — "${card.front}"`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400 pointer-events-none" />
                </div>
              </div>

              {/* Custom message fields */}
              {selectedCard === 13 && (
                <div className="space-y-3 bg-stone-900/50 border border-stone-800 rounded-xl p-4">
                  <div>
                    <label className="text-xs font-bold text-stone-400 uppercase">Card Front</label>
                    <input
                      type="text"
                      placeholder="Write your front message..."
                      value={customFront}
                      onChange={(e) => setCustomFront(e.target.value)}
                      maxLength={60}
                      className="w-full mt-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder:text-stone-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-400 uppercase">Card Inside</label>
                    <textarea
                      placeholder="Write your inside message..."
                      value={customInside}
                      onChange={(e) => setCustomInside(e.target.value)}
                      maxLength={200}
                      rows={2}
                      className="w-full mt-1 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder:text-stone-500 focus:border-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* CTA */}
              <GlowButton onClick={handleCheckout} className="w-full" size="xl">
                ORDER NOW — $250.00
              </GlowButton>

              {/* Trust Row */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-400">
                <span className="flex items-center gap-1"><Lock className="h-3.5 w-3.5" /> Secure Checkout</span>
                <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> Free Shipping</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> 5.0 Rating</span>
                <span className="flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Custom Made</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══ C. Social Proof Bar ═══ */}
      <SocialProofBar />

      {/* ═══ D. Face Upload Section ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-4 tracking-tight">
              UPLOAD THE <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">VICTIM</span>
            </h2>
            <p className="text-stone-400 text-center text-lg mb-12 max-w-xl mx-auto">
              Upload their face and preview the sculpture. Our artists will sculpt the final piece with even more detail.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <FacePreview onFaceData={setFaceImageData} />
          </FadeUp>
        </div>
      </section>

      {/* ═══ E. How It Works ═══ */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-4 tracking-tight">
              HOW IT <span className="text-amber-400">WORKS</span>
            </h2>
            <p className="text-stone-400 text-center text-lg mb-16 max-w-xl mx-auto">
              Three steps to immortalizing someone as the ultimate DickHead.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "📸", title: "Upload Their Face", desc: "Drop in a clear photo. Front-facing works best. We'll handle the rest." },
              { icon: "🏗️", title: "We Sculpt & Print", desc: "Our artists 3D-model their face onto the golden sculpture. Printed in premium resin with metallic gold finish." },
              { icon: "📦", title: "Ship Anonymously", desc: "Arrives in discreet packaging. No return address. They'll never know who crowned them." },
            ].map((step, i) => (
              <FadeUp key={i} delay={i * 0.15}>
                <div className="text-center bg-stone-900/50 border border-stone-800 rounded-2xl p-8 hover:border-amber-500/30 transition-all duration-300">
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <div className="text-xs text-amber-500 font-bold tracking-widest mb-3">STEP {i + 1}</div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-stone-400 leading-relaxed">{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ F. Card Showcase ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-4 tracking-tight">
              PICK YOUR <span className="text-amber-400">ROAST</span>
            </h2>
            <p className="text-stone-400 text-center text-lg mb-16">
              12 pre-written cards. Or write your own masterpiece.
            </p>
          </FadeUp>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Card Preview */}
            <FadeUp>
              <div className="perspective-1000 max-w-sm sm:max-w-md mx-auto">
                <div
                  className="relative w-full aspect-[3/4] cursor-pointer"
                  onClick={() => setCardFlipped(!cardFlipped)}
                >
                  {/* Front */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 border-2 border-amber-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                      cardFlipped ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    <div className="text-xs text-amber-500 font-bold tracking-widest mb-6">FRONT</div>
                    <p className="text-2xl sm:text-3xl font-bold italic leading-tight">
                      {selectedCard === 13
                        ? (customFront || "Your message here...")
                        : `"${currentCard.front}"`}
                    </p>
                    <div className="absolute bottom-6 text-xs text-stone-500">Tap to flip</div>
                  </div>

                  {/* Inside */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900 border-2 border-amber-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                      cardFlipped ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-95"
                    }`}
                  >
                    <div className="text-xs text-amber-500 font-bold tracking-widest mb-6">INSIDE</div>
                    <p className="text-lg sm:text-xl text-stone-300 leading-relaxed italic">
                      {selectedCard === 13
                        ? (customInside || "Your inside message here...")
                        : `"${currentCard.inside}"`}
                    </p>
                    <div className="absolute bottom-6 text-xs text-stone-500">Tap to flip back</div>
                  </div>
                </div>
              </div>
            </FadeUp>

            {/* Card List */}
            <FadeUp delay={0.2}>
              <div className="space-y-2 max-h-[600px] overflow-y-auto overflow-x-hidden pr-2 scrollbar-thin">
                {CARD_OPTIONS.map(card => (
                  <button
                    key={card.id}
                    onClick={() => { setSelectedCard(card.id); setCardFlipped(false); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                      selectedCard === card.id
                        ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                        : "bg-stone-900/50 border-stone-800 hover:border-stone-600"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        selectedCard === card.id ? "border-amber-500 bg-amber-500" : "border-stone-600"
                      }`}>
                        {selectedCard === card.id && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-white">
                          {card.id === 13 ? "Custom Message" : card.name}
                        </div>
                        {card.id !== 13 && (
                          <div className="text-xs text-stone-400 mt-1 truncate">
                            "{card.front}" &rarr; "{card.inside.slice(0, 50)}..."
                          </div>
                        )}
                        {card.id === 13 && (
                          <div className="text-xs text-stone-400 mt-1">Write your own front & inside message</div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══ G. Why This Gift? ═══ */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-16 tracking-tight">
              WHY THIS <span className="text-amber-400">GIFT?</span>
            </h2>
          </FadeUp>

          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { icon: "✨", title: "Premium 3D-Printed Quality", desc: "Solid resin with metallic gold finish. 8 inches tall. Weighty and impressive. This isn't cheap plastic." },
              { icon: "😂", title: "The Ultimate Roast", desc: "Nothing says 'you're a dickhead' like a golden sculpture with their actual face on it." },
              { icon: "📸", title: "Custom Face Sculpting", desc: "Upload any photo. Our artists sculpt a detailed likeness. The preview is just the beginning." },
              { icon: "🕵️", title: "Anonymous Shipping", desc: "No return address. Discreet packaging. They'll display it before they figure out who sent it." },
            ].map((feature, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="flex gap-5 bg-stone-900/50 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
                  <div className="text-4xl flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-stone-400 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ H. Reviews ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black uppercase mb-4 tracking-tight">
                WHAT PEOPLE <span className="text-amber-400">SAY</span>
              </h2>
              <div className="flex items-center justify-center gap-2 text-lg">
                <StarRating />
                <span className="text-stone-400">5.0/5 from early orders</span>
              </div>
            </div>
          </FadeUp>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((review, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-6 hover:border-amber-500/20 transition-all duration-300">
                  <StarRating count={review.stars} />
                  <p className="text-stone-300 mt-4 mb-4 italic leading-relaxed">
                    "{review.text}"
                  </p>
                  <p className="text-sm font-bold text-stone-500">&mdash; {review.author}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ I. FAQ ═══ */}
      <section className="py-20 px-4 bg-stone-900/30">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <h2 className="text-4xl sm:text-5xl font-black uppercase text-center mb-16 tracking-tight">
              STILL GOT <span className="text-amber-400">QUESTIONS?</span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <Accordion type="single" collapsible className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-stone-900/50 border border-stone-800 rounded-xl px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-left font-bold text-white hover:text-amber-400 hover:no-underline py-5">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-stone-400 leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>

      {/* ═══ J. Final CTA ═══ */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeUp>
            <div className="text-7xl mb-8">👑</div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase mb-4 tracking-tight">
              STILL THINKING?
            </h2>
            <p className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 bg-clip-text text-transparent mb-3">
              THEY'RE STILL A DICKHEAD.
            </p>
            <p className="text-xl text-stone-400 italic font-serif mb-10">
              Immortalize it.
            </p>

            <GlowButton onClick={handleCheckout} className="w-full max-w-md mx-auto" size="xl">
              ORDER NOW — $250.00
            </GlowButton>

            <div className="flex items-center justify-center gap-4 mt-6 text-xs text-stone-500">
              <span>Custom sculpted</span>
              <span>&middot;</span>
              <span>Free shipping</span>
              <span>&middot;</span>
              <span>Anonymous delivery</span>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-stone-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-stone-500">
          <Link to="/" className="hover:text-amber-500 transition-colors">
            <span className="text-amber-500 font-bold">CORPORATE</span> PRANKS
          </Link>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-stone-300 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-stone-300 transition-colors">Privacy</Link>
            <Link to="/support" className="hover:text-stone-300 transition-colors">Support</Link>
          </div>
          <p>&copy; 2026 Corporate Pranks</p>
        </div>
      </footer>

      {/* ═══ K. Mobile Sticky Bottom Bar ═══ */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-stone-950/95 backdrop-blur-md border-t border-stone-800 px-4 py-3 transition-all duration-300 ${
          showStickyBar
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <span className="text-xl font-black text-white">$250</span>
            <span className="text-sm text-stone-500 line-through ml-2">$399.99</span>
          </div>
          <GlowButton onClick={handleCheckout} className="flex-1" size="md">
            ORDER NOW
          </GlowButton>
        </div>
      </div>
    </div>
  );
}

// ─── Social Proof Bar ───────────────────────────────────────────────────────────

function SocialProofBar() {
  const { ref, isInView } = useInView(0.3);
  const sculpturesMade = useAnimatedCounter(847, 2000, isInView);
  const rating = useAnimatedCounter(50, 1500, isInView);
  const wouldSend = useAnimatedCounter(97, 1800, isInView);

  return (
    <section ref={ref} className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 py-8 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center text-stone-950">
        <div>
          <div className="text-3xl sm:text-4xl font-black">{sculpturesMade.toLocaleString()}+</div>
          <div className="text-sm text-amber-900 mt-1 font-medium">Sculptures Made</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-black">{(rating / 10).toFixed(1)}</div>
          <div className="text-sm text-amber-900 mt-1 font-medium">Star Rating</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-black">{wouldSend}%</div>
          <div className="text-sm text-amber-900 mt-1 font-medium">Would Send Again</div>
        </div>
      </div>
    </section>
  );
}
