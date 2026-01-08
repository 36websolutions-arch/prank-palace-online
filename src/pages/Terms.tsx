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
          <p className="text-foreground font-medium mb-6">Effective Date: January 3rd, 2026</p>
          
          <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
            <p>
              These Terms of Use ("Terms") govern your access to and use of corporatepranks.com and any related websites, products, services, memberships, content, communications, or offerings operated by Pranks HQ LLC ("Pranks HQ," "we," "us," or "our").
            </p>
            <p>
              By accessing, browsing, submitting information to, registering with, or purchasing from the Site, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Site.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">1. Eligibility and Access</h2>
            <p>
              You must be at least 18 years old to use the Site. By using the Site, you represent that you are legally capable of entering into binding agreements.
            </p>
            <p>
              The Site is operated from the United States but may be accessed globally. Users accessing the Site from outside the United States are responsible for compliance with their local laws.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">2. Nature of the Site and Services</h2>
            <p>
              Pranks HQ provides prank-related physical products, digital products, memberships, marketing programs, entertainment content, and novelty services.
            </p>
            <p>
              All offerings are provided for entertainment purposes only. We make no representations or guarantees regarding outcomes, reactions, effectiveness, humor, emotional response, or third-party behavior.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">3. Anonymous Gifting and Prank Responsibility</h2>
            <p>
              Certain services offered by Pranks HQ allow users to send products, messages, or subscriptions to third parties, including anonymously.
            </p>
            <p>By using these services, you agree that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are solely responsible for the content, intent, legality, and consequences of any prank, gift, or communication you initiate.</li>
              <li>You will not use the Site to harass, threaten, impersonate, defame, stalk, abuse, or violate the rights of others.</li>
              <li>You will not submit false information, impersonate another person, or misrepresent your identity in violation of applicable law.</li>
              <li>Pranks HQ does not verify recipient consent and does not assume responsibility for recipient reactions.</li>
            </ul>
            <p>
              We reserve the right, at our sole discretion, to refuse, cancel, modify, or terminate any prank, order, or service that we believe may be abusive, unlawful, or harmful.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">4. User Information and Privacy</h2>
            <p>
              Your use of the Site is subject to our Privacy Policy, which governs how we collect, use, share, and protect information.
            </p>
            <p>By using the Site, you acknowledge and agree that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Information you submit may be processed as described in the Privacy Policy.</li>
              <li>Your rights to access, deletion, and opt-out are governed by applicable law and the Privacy Policy.</li>
              <li>Nothing in these Terms overrides your statutory privacy rights.</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">5. Marketing and Communications Consent</h2>
            <p>
              By providing contact information and using the Site, you consent to receive communications from Pranks HQ for lawful business, marketing, and entertainment purposes, including emails, texts, phone calls, direct messages, and notifications, as permitted by law.
            </p>
            <p>
              Communications may include promotional messages, product announcements, membership notices, humor-based content, satire, and prank-related messaging.
            </p>
            <p>You acknowledge that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Communications may be irreverent, humorous, satirical, or unconventional.</li>
              <li>Message frequency may vary.</li>
              <li>Message and data rates may apply.</li>
            </ul>
            <p>
              You may opt out of specific communication methods at any time where required by law. Opt-out requests will be honored prospectively in accordance with applicable regulations.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">6. TCPA and Electronic Communications</h2>
            <p>
              By submitting your contact information, you provide express written consent to receive marketing communications via automated or non-automated means, including SMS, MMS, and calls, as permitted by law.
            </p>
            <p>
              Consent is not a condition of purchase. You may revoke consent for specific channels at any time by following opt-out instructions.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">7. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Site for unlawful, abusive, or fraudulent purposes</li>
              <li>Interfere with Site security or operations</li>
              <li>Attempt to access systems or data without authorization</li>
              <li>Use the Site in a manner that could expose Pranks HQ to liability</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">8. No Claims Based on Subjective Reaction</h2>
            <p>
              You agree not to assert claims against Pranks HQ based on subjective reactions, including offense, annoyance, embarrassment, misunderstanding of humor, or dissatisfaction with prank outcomes.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">9. Intellectual Property and Submissions</h2>
            <p>
              All Site content, branding, and materials are owned by or licensed to Pranks HQ.
            </p>
            <p>
              If you submit content, ideas, media, or materials, you grant Pranks HQ a non-exclusive, worldwide, royalty-free, perpetual license to use, modify, distribute, and display such content in connection with our business.
            </p>
            <p>
              We are under no obligation to use or compensate you for submitted materials.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">10. Disclaimer of Warranties</h2>
            <p className="uppercase font-medium">
              THE SITE AND ALL PRODUCTS AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">11. Limitation of Liability</h2>
            <p className="uppercase font-medium">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, PRANKS HQ LLC SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, EXEMPLARY, OR PUNITIVE DAMAGES ARISING FROM:
            </p>
            <ul className="list-disc pl-6 space-y-2 uppercase font-medium">
              <li>USE OF THE SITE</li>
              <li>PRANK OR GIFT OUTCOMES</li>
              <li>COMMUNICATIONS OR MARKETING</li>
              <li>THIRD-PARTY REACTIONS</li>
              <li>DATA PROCESSING AS DESCRIBED IN THE PRIVACY POLICY</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">12. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Pranks HQ LLC from any claims, damages, losses, or expenses arising from:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your use of the Site</li>
              <li>Your pranks or communications</li>
              <li>Violations of these Terms</li>
              <li>Violations of law or third-party rights</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">13. Termination</h2>
            <p>
              We may suspend or terminate access to the Site at any time, with or without notice, for any reason.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">14. Governing Law and Venue</h2>
            <p>
              These Terms are governed by the laws of the State of Florida. Any disputes shall be resolved exclusively in courts located in Florida.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">15. Changes to These Terms</h2>
            <p>
              We may modify these Terms at any time. Continued use of the Site constitutes acceptance of the revised Terms.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">16. Acknowledgment</h2>
            <p>
              By using the Site, you confirm that you have read, understood, and agree to these Terms of Use.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">17. Contact Information</h2>
            <p>
              For questions regarding these Terms, contact: <a href="mailto:Info@corporatepranks.com" className="text-primary hover:underline">📧 Info@corporatepranks.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
