import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AmbientToasts } from "@/components/AmbientToasts";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import Story from "./pages/Story";
import PerformanceReview from "./pages/PerformanceReview";
import TheAllHandsMeeting from "./pages/TheAllHandsMeeting";
import TheReturnToOffice from "./pages/TheReturnToOffice";
import TheDepartmentOfImperialEfficiency from "./pages/TheDepartmentOfImperialEfficiency";
import TheWarOfTheOracles from "./pages/TheWarOfTheOracles";
import TheScrollsOfTheIsland from "./pages/TheScrollsOfTheIsland";
import TheFestivitasOfOil from "./pages/TheFestivitasOfOil";
import Auth from "./pages/Auth";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import DigitalProducts from "./pages/DigitalProducts";
import PhysicalProducts from "./pages/PhysicalProducts";
import SubscriptionProducts from "./pages/SubscriptionProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import DigitalCheckout from "./pages/DigitalCheckout";
import SubscriptionCheckout from "./pages/SubscriptionCheckout";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin";
import BlogDetails from "./pages/BlogDetails";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import Chronicles from "./pages/Chronicles";
import Armory from "./pages/Armory";
import YouSmellLikeShit from "./pages/YouSmellLikeShit";
import YourBreathStinks from "./pages/YourBreathStinks";
import ForumEconomicus from "./pages/ForumEconomicus";
import { ScrollToTop } from "./components/ScrollToTop";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <AmbientToasts />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home2 />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/home2" element={<Home />} />
              <Route path="/story/:id" element={<Story />} />
              <Route path="/chronicle/the-performance-review" element={<PerformanceReview />} />
              <Route path="/chronicle/the-all-hands-meeting" element={<TheAllHandsMeeting />} />
              <Route path="/chronicle/the-return-to-office" element={<TheReturnToOffice />} />
              <Route path="/chronicle/the-department-of-imperial-efficiency" element={<TheDepartmentOfImperialEfficiency />} />
              <Route path="/chronicle/the-war-of-the-oracles" element={<TheWarOfTheOracles />} />
              <Route path="/chronicle/the-scrolls-of-the-island" element={<TheScrollsOfTheIsland />} />
              <Route path="/chronicle/the-festivitas-of-oil" element={<TheFestivitasOfOil />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/digital-products" element={<DigitalProducts />} />
              <Route path="/physical-products" element={<PhysicalProducts />} />
              <Route path="/subscription-products" element={<SubscriptionProducts />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/digital-checkout/:id" element={<DigitalCheckout />} />
              <Route path="/subscription-checkout/:id" element={<SubscriptionCheckout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/support" element={<Support />} />
              <Route path="/chronicles" element={<Chronicles />} />
              <Route path="/armory" element={<Armory />} />
              <Route path="/you-smell-like-shit" element={<YouSmellLikeShit />} />
              <Route path="/your-breath-stinks" element={<YourBreathStinks />} />
              <Route path="/forum-economicus" element={<ForumEconomicus />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
