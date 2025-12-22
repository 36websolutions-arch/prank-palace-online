import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-secondary joker-pattern p-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/auth">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign Up
          </Button>
        </Link>
        
        <div className="bg-card rounded-2xl shadow-card p-8 border">
          <h1 className="font-display text-3xl text-primary mb-6">Privacy Policy</h1>
          
          <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
            <p className="text-foreground font-medium">Last updated: December 2024</p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including your name, email address, 
              phone number (optional), shipping address, and payment information when you make a purchase.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Send you order confirmations and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Improve our products and services</li>
              <li>Send promotional communications (with your consent)</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">3. Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to outside parties 
              except for trusted third parties who assist us in operating our website and conducting our 
              business (such as payment processors and shipping partners).
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">4. Data Security</h2>
            <p>
              We implement a variety of security measures to maintain the safety of your personal 
              information. Your payment information is encrypted and processed securely through PayPal.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">5. Cookies</h2>
            <p>
              We use cookies to enhance your experience on our website. You can choose to disable 
              cookies through your browser settings, but this may affect some functionality.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">6. Your Rights</h2>
            <p>
              You have the right to access, update, or delete your personal information at any time. 
              You can do this through your account settings or by contacting us directly.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">7. Children's Privacy</h2>
            <p>
              Our services are not intended for users under 18 years of age. We do not knowingly 
              collect personal information from children.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">9. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
