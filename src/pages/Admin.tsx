import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DigitalOrdersTab } from "@/components/admin/DigitalOrdersTab";
import { PhysicalOrdersTab } from "@/components/admin/PhysicalOrdersTab";
import { SubscriptionOrdersTab } from "@/components/admin/SubscriptionOrdersTab";
import { AddProductTab } from "@/components/admin/AddProductTab";
import { AddSubscriptionProductTab } from "@/components/admin/AddSubscriptionProductTab";
import { ManageProductsTab } from "@/components/admin/ManageProductsTab";
import { UserInfoTab } from "@/components/admin/UserInfoTab";
import { Package, Zap, PlusCircle, Settings, RefreshCw, Users } from "lucide-react";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("digital-orders");

  if (!loading && !user) return <Navigate to="/auth" replace />;
  if (!loading && !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🃏</span>
            <h1 className="font-display text-4xl">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage your prank empire from here, boss! 😈</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 mb-8">
            <TabsTrigger value="digital-orders" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Digital</span>
            </TabsTrigger>
            <TabsTrigger value="physical-orders" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Physical</span>
            </TabsTrigger>
            <TabsTrigger value="subscription-orders" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="user-info" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">User Info</span>
            </TabsTrigger>
            <TabsTrigger value="add-product" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </TabsTrigger>
            <TabsTrigger value="add-subscription" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Add Sub</span>
            </TabsTrigger>
            <TabsTrigger value="manage-products" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Manage</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="digital-orders">
            <DigitalOrdersTab />
          </TabsContent>
          <TabsContent value="physical-orders">
            <PhysicalOrdersTab />
          </TabsContent>
          <TabsContent value="subscription-orders">
            <SubscriptionOrdersTab />
          </TabsContent>
          <TabsContent value="user-info">
            <UserInfoTab />
          </TabsContent>
          <TabsContent value="add-product">
            <AddProductTab />
          </TabsContent>
          <TabsContent value="add-subscription">
            <AddSubscriptionProductTab />
          </TabsContent>
          <TabsContent value="manage-products">
            <ManageProductsTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
