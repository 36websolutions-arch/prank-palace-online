import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Footer() {
  return (
    <footer className="bg-secondary py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <img
                src={logo}
                alt="Corporate Pranks Logo"
                className="h-10 w-10 rounded-full object-cover animate-gentle-float"
              />
              <span className="font-display text-2xl text-primary">
                Corporate Pranks
              </span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              The ultimate destination for office mischief and digital mayhem.
              Delivering laughs with just enough disruption. One prank at a
              time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/subscription-products"
                  className="text-muted-foreground hover:text-primary transition-colors">
                  Strange Interests Initiative
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-muted-foreground hover:text-primary transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-4">Contact</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li>
                <p className="font-medium text-foreground text-sm">Email</p>
                <p>Info@corporatepranks.com</p>
              </li>
              <li>
                <p className="font-medium text-foreground text-sm">
                  Mischief Headquarters
                </p>
                <p>
                  331 Newman Springs Rd., Bldg. 1, 4th Floor Suite 143 Red Bank,
                  NJ 07701
                </p>
                <p>Suite 143 </p>
                <p>Red Bank, NJ 07701</p>
              </li>
              <li>
                <p className="font-medium text-foreground text-sm">
                  Mailing Address
                </p>
                <p>331 Newman Springs Rd., Bldg. 1, 4th Floor</p>
                <p>Suite 143</p>
                <p>Red Bank, NJ 07701</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Corporate Pranks. All rights
            reserved.
          </p>
          <p className="text-sm mt-2">
            No pranks were harmed in the making of this website 🎭
          </p>
        </div>
      </div>
    </footer>
  );
}
