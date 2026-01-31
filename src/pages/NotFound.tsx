import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, Scroll } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-6">
            <Scroll className="h-12 w-12 text-amber-600" />
          </div>
          <h1 className="font-display text-6xl text-stone-900 dark:text-stone-100 mb-4">404</h1>
          <p className="text-xl text-stone-600 dark:text-stone-400 mb-2">This scroll has been lost to history</p>
          <p className="text-stone-500 dark:text-stone-500 mb-8">
            The page you seek does not exist in the chronicles.
          </p>
          <Link to="/">
            <Button className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
              <Home className="h-4 w-4" />
              Return to the Chronicle
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
