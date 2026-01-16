import { useState, useRef } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { JokerSpinner } from "@/components/JokerLoader";
import { z } from "zod";
import logo from "@/assets/logo.png";
import { trackSignUpAttempt, trackSignUpSuccess, trackSignUpFailure } from "@/lib/analytics";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  nickname: z.string().min(2, "Nickname must be at least 2 characters").optional(),
  phone: z.string().optional(),
});

type AuthMode = "login" | "signup" | "forgot";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSigningUp = useRef(false);
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Don't redirect if we're in the middle of signing up
  if (user && !isSigningUp.current) return <Navigate to="/" replace />;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({ title: "Email Required", description: "Please enter your email address", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      });
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Check your email! 📧", description: "We've sent you a password reset link." });
        setMode("login");
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "forgot") {
      return handleForgotPassword(e);
    }
    
    // Check for terms and privacy acceptance on signup
    if (mode === "signup") {
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
        nickname: mode === "login" ? undefined : nickname,
        phone: mode === "login" ? undefined : phone || undefined 
      });
      if (!validation.success) {
        toast({ title: "Validation Error", description: validation.error.errors[0].message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // Set flag before signup to prevent auto-redirect to home
      if (mode === "signup") {
        isSigningUp.current = true;
        trackSignUpAttempt();
      }

      const { error } = mode === "login" 
        ? await signIn(email, password) 
        : await signUp(email, password, nickname, phone || undefined);

      if (error) {
        isSigningUp.current = false;
        if (mode === "signup") {
          trackSignUpFailure(error.message);
        }
        toast({ title: "Oops!", description: error.message, variant: "destructive" });
      } else {
        if (mode === "signup") {
          trackSignUpSuccess();
          // Send welcome email (fire and forget)
          supabase.functions.invoke('send-welcome-email', {
            body: { email, nickname }
          }).catch(err => console.error("Failed to send welcome email:", err));
          
          toast({ title: "Welcome to the chaos! 😈", description: "Your prank journey begins now!" });
          navigate("/", { replace: true });
          isSigningUp.current = false;
        } else {
          toast({ title: "Welcome back, Prankster! 🃏", description: "Time to spread some mischief!" });
          navigate("/", { replace: true });
        }
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const canSubmitSignup = mode === "login" || mode === "forgot" || (termsAccepted && privacyAccepted);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary joker-pattern p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src={logo} 
            alt="Corporate Pranks" 
            className="w-20 h-20 object-contain mx-auto mb-4 animate-gentle-float"
          />
          <h1 className="font-display text-4xl text-primary mb-2">Corporate Pranks</h1>
          <p className="text-muted-foreground">
            {mode === "login" && "Welcome back, mischief maker!"}
            {mode === "signup" && "Join the chaos crew!"}
            {mode === "forgot" && "Forgot your password? No worries!"}
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-8 border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
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
            
            {mode !== "forgot" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            )}
            
            {mode === "login" && (
              <div className="text-right">
                <button 
                  type="button" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setMode("forgot")}
                >
                  Forgot password?
                </button>
              </div>
            )}
            
            {mode === "signup" && (
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
              {loading ? <JokerSpinner /> : (
                <>
                  {mode === "login" && "Unleash the Pranks! 🎭"}
                  {mode === "signup" && "Join the Mischief! 😈"}
                  {mode === "forgot" && "Send Reset Link 📧"}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {mode === "forgot" ? (
              <button 
                type="button" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors" 
                onClick={() => setMode("login")}
              >
                Back to login
              </button>
            ) : (
              <button 
                type="button" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors" 
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
              >
                {mode === "login" ? "New prankster? Sign up here!" : "Already a member? Log in!"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
