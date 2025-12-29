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
          <h1 className="font-display text-3xl text-primary mb-2">Privacy Policy</h1>
          <p className="text-foreground font-medium mb-6">Effective Date: December 25, 2025</p>
          
          <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
            <p>
              Pranks HQ LLC ("we," "us," or "our") operates this website (the "Site"). This Privacy Policy explains how we collect, use, disclose, and protect information when you access or use the Site.
            </p>
            <p>
              By using the Site, you consent to the practices described in this Privacy Policy.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">1. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            
            <h3 className="text-lg font-medium text-foreground mt-4">a. Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, phone number</li>
              <li>Information submitted through forms, sign-ups, or communications</li>
              <li>Any content or materials you choose to submit</li>
            </ul>
            
            <h3 className="text-lg font-medium text-foreground mt-4">b. Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address</li>
              <li>Browser type and device information</li>
              <li>Pages visited, referring URLs, and usage activity</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            
            <h3 className="text-lg font-medium text-foreground mt-4">c. Third-Party Sources</h3>
            <p>
              We may receive information from third-party services, analytics providers, advertising partners, or platforms you interact with in connection with our Site.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">2. How We Use Information</h2>
            <p>We use information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Operate and maintain the Site</li>
              <li>Provide services, content, and communications</li>
              <li>Improve functionality, performance, and user experience</li>
              <li>Send marketing, promotional, or informational messages</li>
              <li>Analyze usage trends and engagement</li>
              <li>Comply with legal obligations</li>
              <li>Protect against fraud, abuse, or misuse</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">3. Cookies and Tracking Technologies</h2>
            <p>We use cookies, pixels, and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Understand how users interact with the Site</li>
              <li>Customize content and advertising</li>
              <li>Measure effectiveness of campaigns</li>
            </ul>
            <p>
              You may adjust your browser settings to refuse cookies, but some features of the Site may not function properly.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">4. Sharing of Information</h2>
            <p>We may share information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With service providers and vendors who assist in operating the Site</li>
              <li>With marketing, analytics, and advertising partners</li>
              <li>To comply with legal obligations, court orders, or lawful requests</li>
              <li>To protect our rights, property, or safety, or that of others</li>
              <li>In connection with a business transfer, merger, sale, or acquisition</li>
            </ul>
            <p>
              We do not guarantee that shared information will remain confidential once disclosed to third parties.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">5. International Users</h2>
            <p>
              The Site is operated from the United States. If you access the Site from outside the United States, you understand and agree that your information may be transferred to, stored, and processed in the United States or other jurisdictions where data protection laws may differ from those in your country.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">6. Your Rights and Choices</h2>
            <p>Depending on your location, you may have rights to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access or request a copy of your personal information</li>
              <li>Request correction or deletion of information</li>
              <li>Opt out of certain communications</li>
            </ul>
            <p>
              To exercise any rights, contact us using the information below. We reserve the right to verify requests and decline requests where permitted by law.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">7. Data Security</h2>
            <p>
              We use reasonable administrative, technical, and physical measures to protect information. However, no system is completely secure, and we cannot guarantee absolute security of any data.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">8. Third-Party Links</h2>
            <p>
              The Site may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those third parties.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">9. Children's Privacy</h2>
            <p>
              The Site is not intended for children under the age of 18. We do not knowingly collect personal information from children.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy at any time. Changes will be effective immediately upon posting. Continued use of the Site constitutes acceptance of the updated policy.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, you may contact us at:</p>
            <p className="font-medium">
              Pranks HQ LLC<br />
              📧 Email: <a href="mailto:prankscorporate@gmail.com" className="text-primary hover:underline">prankscorporate@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
