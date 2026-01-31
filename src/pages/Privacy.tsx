import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/auth">
            <Button variant="ghost" className="mb-6 text-stone-600 dark:text-stone-400 hover:text-amber-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sign Up
            </Button>
          </Link>

          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-lg p-8 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-6 w-6 text-amber-600" />
              <h1 className="font-display text-3xl text-stone-900 dark:text-stone-100">Privacy Policy</h1>
            </div>
            <p className="text-stone-900 dark:text-stone-100 font-medium mb-6">Effective Date: January 3rd, 2026</p>

            <div className="prose prose-sm max-w-none space-y-4 text-stone-600 dark:text-stone-400">
              <p>
                Pranks HQ LLC ("we," "us," or "our") operates this website (the "Site"). This Privacy Policy explains how we collect, use, disclose, and protect information when you access or use the Site. By using the Site, you consent to the practices described in this Privacy Policy.
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 my-6">
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">IMPORTANT NOTICE</h3>
                <p className="text-sm">
                  This Site uses cookies, pixels, tags, analytics tools, advertising technologies, and similar tracking mechanisms to understand how visitors use the Site, improve functionality, and support marketing efforts. These tools may collect information about your visit, including pages viewed, interactions, time on page, referring URLs, device identifiers, and approximate location derived from IP address. You may manage tracking preferences through your browser settings and available opt-out tools described below.
                </p>
              </div>

              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-6">Information We Collect</h2>

              <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mt-4">a. Information You Provide</h3>
              <p>We may collect personal information you voluntarily provide, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Information submitted through forms, sign-ups, or communications</li>
                <li>Any content or materials you choose to submit</li>
              </ul>

              <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mt-4">b. Automatically Collected Information</h3>
              <p>When you access the Site, we may automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and device information</li>
                <li>Operating system</li>
                <li>Pages visited, referring URLs, timestamps, and usage activity</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-lg font-medium text-stone-900 dark:text-stone-100 mt-4">c. Third-Party Sources</h3>
              <p>
                We may receive information from third-party services, analytics providers, advertising partners, payment processors, or platforms you interact with in connection with the Site.
              </p>

              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-6">How We Use Information</h2>
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

              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-6">Cookies and Tracking Technologies</h2>
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

              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-6">Opt-Out Options (Where Applicable)</h2>
              <p>You may opt out of certain tracking and advertising technologies using the following tools:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Google Analytics opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">https://tools.google.com/dlpage/gaoptout</a></li>
                <li>Google ad settings: <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">https://adssettings.google.com/</a></li>
                <li>Network Advertising Initiative opt-out: <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">https://www.networkadvertising.org/choices/</a></li>
                <li>Digital Advertising Alliance opt-out: <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">https://optout.aboutads.info/</a></li>
              </ul>

              <h2 className="text-xl font-semibold text-stone-900 dark:text-stone-100 mt-6">Contact Us</h2>
              <p>If you have questions or requests regarding this Privacy Policy, contact us at:</p>
              <p className="font-medium text-stone-900 dark:text-stone-100">
                Pranks HQ LLC<br />
                Email: <a href="mailto:prankscorporate@gmail.com" className="text-amber-600 hover:underline">prankscorporate@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
