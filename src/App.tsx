import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Home2 from "./pages/Home2";
import Story from "./pages/Story";
import PerformanceReview from "./pages/PerformanceReview";
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


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home2" element={<Home2 />} />
              <Route path="/story/:id" element={<Story />} />
              <Route path="/chronicle/the-performance-review" element={<PerformanceReview />} />
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
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
