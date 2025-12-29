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
          <h1 className="font-display text-3xl text-primary mb-2">TERMS OF USE – PRANKS HQ</h1>
          <p className="text-foreground font-medium mb-6">Effective Date: December 25, 2025</p>
          
          <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
            <p>
              corporatepranks.com (the "Site") is owned and operated by Pranks HQ LLC ("we," "us," or "our"). 
              The Site provides prank-related products, digital content, memberships, marketing programs, and entertainment services.
            </p>
            <p>
              By accessing, browsing, signing up for, submitting information to, or purchasing from the Site, 
              you agree to these Terms of Use ("Terms"). Your use of the Site constitutes your agreement to these Terms. 
              If you do not agree, do not use the Site.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">1. Eligibility</h2>
            <p>
              You must be at least 18 years old and reside in the United States to use the Site. 
              By using the Site, you represent and warrant that all information you provide is accurate, current, and truthful.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">2. Nature of the Site and Services</h2>
            <p>
              Pranks HQ provides physical products, digital products, memberships, marketing offers, and prank-related entertainment content and services.
            </p>
            <p>
              All offerings are provided for entertainment purposes only. We make no guarantees regarding outcomes, reactions, effectiveness, humor, or results.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">3. User Information & Data Collection</h2>
            <p>
              By submitting any information on the Site, including but not limited to your name, email address, phone number, 
              IP address, demographic information, or other identifying data ("User Information"), you authorize Pranks HQ LLC 
              to collect, store, use, analyze, monetize, and commercialize such information.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">4. Consent to Data Sharing, Sale, and Resale</h2>
            <p>By using the Site or submitting information, you expressly consent to the following:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your User Information may be shared, sold, resold, licensed, rented, or transferred to third-party companies, affiliates, advertisers, data partners, and service providers</li>
              <li>Third parties may contact you for marketing, promotional, or commercial purposes</li>
              <li>Your information may be combined with other datasets for analytics, profiling, or monetization</li>
              <li>We may continue to use and resell your information even if you stop using the Site</li>
            </ul>
            <p>
              You acknowledge that Pranks HQ LLC does not control and is not responsible for how third parties use your information once shared.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">5. Consent to Marketing, Humor, and Promotional Communications</h2>
            <p>
              By signing up for or using the Site, you authorize Pranks HQ LLC to contact you directly for any lawful business or entertainment purpose, including marketing and promotional messages, product announcements, membership communications, prank content, jokes, memes, satire, humorous material, surprise messages, and announcements regarding new content or services.
            </p>
            <p>
              Communications may be sent at our discretion, at any frequency, and via any channel permitted by law, including email, SMS or MMS, phone calls, direct messages, and push notifications.
            </p>
            <p>
              You acknowledge that communications from Pranks HQ LLC may be irreverent, humorous, satirical, unconventional, or prank-oriented, and that this is an inherent part of the brand experience.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">6. TCPA and Electronic Communications Consent</h2>
            <p>
              By submitting your contact information, you provide express consent under applicable marketing and communications laws to receive marketing emails, SMS and MMS messages, automated or non-automated phone calls, and prerecorded or artificial voice messages.
            </p>
            <p>
              Message frequency may vary. Message and data rates may apply. Consent is not a condition of purchase.
            </p>
            <p>
              You may opt out of specific communication methods where required by law, but such opt-out does not retroactively revoke consent already granted or prevent lawful marketing through other channels.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">7. User Responsibility</h2>
            <p>
              You are solely responsible for your interpretation of content, your reaction to prank or humor-based communications, and any decisions made based on communications received.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">8. No Claims Based on Offense or Subjective Reaction</h2>
            <p>
              You agree not to assert any claim against Pranks HQ LLC based on finding content offensive, annoying, inappropriate, or unfunny, or from misinterpreting humor, satire, or prank-related communications.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">9. Intellectual Property</h2>
            <p>
              By submitting any ideas, content, materials, information, or media to Pranks HQ LLC, you represent that you own or have the necessary rights to submit such materials.
            </p>
            <p>
              You retain ownership of your submitted content. However, by submitting content to Pranks HQ LLC, you grant us a non-exclusive, worldwide, royalty-free, perpetual license to use, reproduce, modify, adapt, publish, display, distribute, and otherwise exploit such content in connection with our services, business operations, marketing, and promotional activities.
            </p>
            <p>
              Pranks HQ LLC has no obligation to use or compensate you for any submitted content and reserves the right to remove or refuse any submission at its sole discretion.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">10. Disclaimer of Warranties</h2>
            <p className="uppercase font-medium">
              THE SITE AND ALL PRODUCTS AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE." WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">11. Limitation of Liability</h2>
            <p className="uppercase font-medium">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PRANKS HQ LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES ARISING FROM USE OF THE SITE, DATA SHARING OR RESALE, MARKETING OR COMMUNICATIONS, OR PRANK-RELATED CONTENT OR PRODUCTS.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Pranks HQ LLC from any claims, losses, damages, or expenses arising from your submission of information, third-party communications, use of the Site, or violation of these Terms.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">13. Termination</h2>
            <p>
              We may suspend or terminate your access to the Site at any time, without notice, for any reason.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">14. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Florida, without regard to conflict-of-law principles.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">15. Changes to These Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the Site constitutes acceptance of the revised Terms.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">16. Acknowledgment</h2>
            <p>
              By using this Site, you confirm that you have read, understood, and agree to these Terms of Use.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">17. Contact Information</h2>
            <p>
              For questions regarding these Terms, please contact us at: <a href="mailto:prankscorporate@gmail.com" className="text-primary hover:underline">prankscorporate@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
