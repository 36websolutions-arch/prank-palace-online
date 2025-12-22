import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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
          <h1 className="font-display text-3xl text-primary mb-6">Terms and Conditions</h1>
          
          <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
            <p className="text-foreground font-medium">Last updated: December 2024</p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Corporate Pranks, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do 
              not use this service.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">2. Use of Service</h2>
            <p>
              Corporate Pranks provides prank products and services for entertainment purposes only. 
              You agree to use our products responsibly and in accordance with all applicable laws.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">3. Products and Services</h2>
            <p>
              All products are sold for novelty and entertainment purposes. We are not responsible 
              for any misuse of our products. Users must be 18 years or older to purchase.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">4. Payment Terms</h2>
            <p>
              All payments are processed securely through PayPal. Prices are listed in the currency 
              displayed on the website. We reserve the right to change prices at any time.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">5. Refund Policy</h2>
            <p>
              Digital products are non-refundable once delivered. Physical products may be returned 
              within 14 days of delivery if unopened and in original condition.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">6. Limitation of Liability</h2>
            <p>
              Corporate Pranks shall not be liable for any damages arising from the use or inability 
              to use our products or services. Use products at your own risk.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service 
              after changes constitutes acceptance of the new terms.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">8. Contact</h2>
            <p>
              For any questions regarding these terms, please contact us through our website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
