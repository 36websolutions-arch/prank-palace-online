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
          <p className="text-foreground font-medium mb-6">Effective Date: January 3rd, 2026</p>
          
          <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
            <p>
              Pranks HQ LLC ("we," "us," or "our") operates this website (the "Site"). This Privacy Policy explains how we collect, use, disclose, and protect information when you access or use the Site. By using the Site, you consent to the practices described in this Privacy Policy.
            </p>
            
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 my-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">IMPORTANT NOTICE</h3>
              <p className="text-sm">
                This Site uses cookies, pixels, tags, analytics tools, advertising technologies, and similar tracking mechanisms to understand how visitors use the Site, improve functionality, and support marketing efforts. These tools may collect information about your visit, including pages viewed, interactions, time on page, referring URLs, device identifiers, and approximate location derived from IP address. You may manage tracking preferences through your browser settings and available opt-out tools described below.
              </p>
            </div>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Information We Collect</h2>
            
            <h3 className="text-lg font-medium text-foreground mt-4">a. Information You Provide</h3>
            <p>We may collect personal information you voluntarily provide, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Information submitted through forms, sign-ups, or communications</li>
              <li>Any content or materials you choose to submit</li>
            </ul>
            
            <h3 className="text-lg font-medium text-foreground mt-4">b. Automatically Collected Information</h3>
            <p>When you access the Site, we may automatically collect:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address</li>
              <li>Browser type and device information</li>
              <li>Operating system</li>
              <li>Pages visited, referring URLs, timestamps, and usage activity</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
            
            <h3 className="text-lg font-medium text-foreground mt-4">c. Third-Party Sources</h3>
            <p>
              We may receive information from third-party services, analytics providers, advertising partners, payment processors, or platforms you interact with in connection with the Site.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">How We Use Information</h2>
            <p>We use information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Operate and maintain the Site</li>
              <li>Provide services, content, and communications</li>
              <li>Process transactions</li>
              <li>Improve functionality, performance, and user experience</li>
              <li>Send marketing, promotional, or informational messages</li>
              <li>Analyze usage trends and engagement</li>
              <li>Detect fraud, abuse, or misuse</li>
              <li>Comply with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar technologies (including pixels, tags, scripts, and session replay/heatmaps) to operate the Site, analyze usage, improve performance, and support marketing efforts.
            </p>
            <p>
              Cookies are small text files stored on your device. Cookies may be session-based (deleted when you close your browser) or persistent (remain until deleted or expired).
            </p>
            <p>Types of technologies we may use include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Essential cookies required for Site functionality and security</li>
              <li>Analytics and performance cookies to measure traffic and engagement</li>
              <li>Marketing and advertising cookies to evaluate campaigns and deliver relevant ads</li>
              <li>Functionality cookies to remember preferences and settings</li>
            </ul>
            <p>
              Third-party providers may set their own cookies or tracking technologies in connection with their services.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Opt-Out Options (Where Applicable)</h2>
            <p>You may opt out of certain tracking and advertising technologies using the following tools:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google Analytics opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://tools.google.com/dlpage/gaoptout</a></li>
              <li>Google ad settings: <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://adssettings.google.com/</a></li>
              <li>Network Advertising Initiative opt-out: <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.networkadvertising.org/choices/</a></li>
              <li>Digital Advertising Alliance opt-out: <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://optout.aboutads.info/</a></li>
            </ul>
            <p>
              If we use session replay, heatmaps, or similar tools (such as Hotjar or comparable services), those tools may record interactions with the Site, including mouse movements, clicks, scrolling behavior, and page navigation, for the purpose of improving functionality, usability, and performance. Where required by law, we will obtain user consent before enabling such tools.
            </p>
            <p>
              You may also control cookies through your browser settings. Disabling cookies may affect certain Site features.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Sharing of Information</h2>
            <p>We may share information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With service providers and vendors who assist in operating the Site</li>
              <li>With analytics, advertising, and marketing partners</li>
              <li>To comply with legal obligations, court orders, or lawful requests</li>
              <li>To protect our rights, property, or safety, or that of others</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p>
              We do not guarantee that shared information will remain confidential once disclosed to third parties.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">International Users</h2>
            <p>
              The Site is operated from the United States. If you access the Site from outside the United States, you understand and agree that your information may be transferred to, stored, and processed in the United States or other jurisdictions with different data protection laws.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">GDPR Privacy Rights (EU/EEA Residents)</h2>
            <p>If you are located in the European Union or European Economic Area, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>
              We process personal data based on consent, contractual necessity, legal obligations, and legitimate business interests. Requests may require identity verification.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">CCPA / CPRA Privacy Rights (California Residents)</h2>
            <p>California residents have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Know what personal information we collect</li>
              <li>Request access to or deletion of personal information</li>
              <li>Opt out of the sale or sharing of personal information</li>
              <li>Not be discriminated against for exercising privacy rights</li>
            </ul>
            <p>
              We do not knowingly sell personal information for monetary compensation. Certain advertising technologies may constitute "sharing" under California law. You may opt out by contacting us.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Do Not Track</h2>
            <p>
              The Site does not respond to Do Not Track (DNT) browser signals. You may manage tracking preferences through your browser settings.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Data Security</h2>
            <p>
              We use reasonable administrative, technical, and physical safeguards to protect information. However, no method of transmission or storage is completely secure.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Third-Party Links</h2>
            <p>
              The Site may contain links to third-party websites or services. We are not responsible for their privacy practices or content.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Children's Privacy</h2>
            <p>
              The Site is not intended for individuals under the age of 18. We do not knowingly collect personal information from minors.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy at any time. Changes are effective upon posting. Continued use of the Site constitutes acceptance of the updated policy.
            </p>
            
            <h2 className="text-xl font-semibold text-foreground mt-6">Contact Us</h2>
            <p>If you have questions or requests regarding this Privacy Policy, contact us at:</p>
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
