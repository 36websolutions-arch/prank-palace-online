import { Link } from "react-router-dom";
import { Scroll, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img
                src={logo}
                alt="Corporate Chronicle Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl text-stone-100">The Corporate</span>
                <span className="font-display text-sm text-amber-500 -mt-1">Chronicle</span>
              </div>
            </Link>
            <p className="text-stone-400 max-w-md text-sm leading-relaxed">
              Satire since Rome. Drawing parallels between the ancient empire and modern corporate culture, one chronicle at a time.
            </p>
            <div className="flex items-center gap-2 mt-4 text-amber-500 text-sm">
              <Scroll className="h-4 w-4" />
              <span className="italic">History doesn't repeat itself, but corporate America sure does.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-stone-100 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-stone-400 hover:text-amber-500 transition-colors text-sm">
                  The Chronicles
                </Link>
              </li>
              <li>
                <Link to="/subscription-products" className="text-stone-400 hover:text-amber-500 transition-colors text-sm">
                  Strange Interests Initiative
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-stone-400 hover:text-amber-500 transition-colors text-sm">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-stone-100 mb-4">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-stone-100 font-medium">Email</p>
                  <a href="mailto:Info@corporatepranks.com" className="text-stone-400 hover:text-amber-500 transition-colors">
                    Info@corporatepranks.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-stone-100 font-medium">Senate Headquarters</p>
                  <p className="text-stone-400">331 Newman Springs Rd., Bldg. 1</p>
                  <p className="text-stone-400">4th Floor, Suite 143</p>
                  <p className="text-stone-400">Red Bank, NJ 07701</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm">
          <div className="flex justify-center gap-4 mb-4">
            <Link to="/terms" className="text-stone-400 hover:text-amber-500 transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-stone-600">|</span>
            <Link to="/privacy" className="text-stone-400 hover:text-amber-500 transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p className="text-stone-500">&copy; {new Date().getFullYear()} The Corporate Chronicle. All rights reserved.</p>
          <p className="text-stone-600 text-xs mt-2">Satire Since Rome</p>
        </div>
      </div>
    </footer>
  );
}
