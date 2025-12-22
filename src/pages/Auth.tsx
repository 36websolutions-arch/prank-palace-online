import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { JokerSpinner } from "@/components/JokerLoader";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  nickname: z.string().min(2, "Nickname must be at least 2 characters").optional(),
  phone: z.string().optional(),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for terms and privacy acceptance on signup
    if (!isLogin) {
      if (!termsAccepted) {
        toast({ title: "Terms Required", description: "Please accept the Terms and Conditions", variant: "destructive" });
        return;
      }
      if (!privacyAccepted) {
        toast({ title: "Privacy Policy Required", description: "Please accept the Privacy Policy", variant: "destructive" });
        return;
      }
    }
    
    setLoading(true);

    try {
      const validation = authSchema.safeParse({ 
        email, 
        password, 
        nickname: isLogin ? undefined : nickname,
        phone: isLogin ? undefined : phone || undefined 
      });
      if (!validation.success) {
        toast({ title: "Validation Error", description: validation.error.errors[0].message, variant: "destructive" });
        setLoading(false);
        return;
      }

      const { error } = isLogin 
        ? await signIn(email, password) 
        : await signUp(email, password, nickname, phone || undefined);

      if (error) {
        toast({ title: "Oops!", description: error.message, variant: "destructive" });
      } else {
        toast({ title: isLogin ? "Welcome back, Prankster! 🃏" : "Welcome to the chaos! 😈", description: isLogin ? "Time to spread some mischief!" : "Your prank journey begins now!" });
        navigate("/");
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const canSubmitSignup = isLogin || (termsAccepted && privacyAccepted);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary joker-pattern p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 inline-block animate-wiggle">🃏</span>
          <h1 className="font-display text-4xl text-primary mb-2">Corporate Pranks</h1>
          <p className="text-muted-foreground">{isLogin ? "Welcome back, mischief maker!" : "Join the chaos crew!"}</p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8 border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input id="nickname" placeholder="PrankMaster3000" value={nickname} onChange={(e) => setNickname(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number <span className="text-muted-foreground text-xs">(optional)</span></Label>
                  <Input id="phone" type="tel" placeholder="+1 234 567 8900" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="prankster@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            
            {!isLogin && (
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted} 
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                    I have read and agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline font-medium">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="privacy" 
                    checked={privacyAccepted} 
                    onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                  />
                  <label htmlFor="privacy" className="text-sm text-muted-foreground leading-tight cursor-pointer">
                    I have read and agree to the{" "}
                    <Link to="/privacy" className="text-primary hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              variant="joker" 
              className="w-full" 
              size="lg" 
              disabled={loading || !canSubmitSignup}
            >
              {loading ? <JokerSpinner /> : isLogin ? "Unleash the Pranks! 🎭" : "Join the Mischief! 😈"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button type="button" className="text-sm text-muted-foreground hover:text-primary transition-colors" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "New prankster? Sign up here!" : "Already a member? Log in!"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
