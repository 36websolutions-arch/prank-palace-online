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
import { ManageBlogsTab } from "@/components/admin/ManageBlogsTab";
import { UserInfoTab } from "@/components/admin/UserInfoTab";
import { Package, Zap, PlusCircle, Settings, RefreshCw, Users, FileText, Scroll } from "lucide-react";

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("digital-orders");

  if (!loading && !user) return <Navigate to="/auth" replace />;
  if (!loading && !isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Scroll className="h-8 w-8 text-amber-600" />
            <h1 className="font-display text-4xl text-stone-900 dark:text-stone-100">Admin Dashboard</h1>
          </div>
          <p className="text-stone-600 dark:text-stone-400">Manage the Chronicle from here, Senator.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8 bg-stone-100 dark:bg-stone-800">
            <TabsTrigger value="digital-orders" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900 data-[state=active]:text-amber-600">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Digital</span>
            </TabsTrigger>
            <TabsTrigger value="physical-orders" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900 data-[state=active]:text-amber-600">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Physical</span>
            </TabsTrigger>
            <TabsTrigger value="subscription-orders" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900 data-[state=active]:text-amber-600">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Subscriptions</span>
            </TabsTrigger>
            <TabsTrigger value="user-info" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900 data-[state=active]:text-amber-600">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">User Info</span>
            </TabsTrigger>
            <TabsTrigger value="add-product" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900 data-[state=active]:text-amber-600">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Product</span>
            </TabsTrigger>
            <TabsTrigger value="add-subscription" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900 data-[state=active]:text-amber-600">
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Add Sub</span>
            </TabsTrigger>
            <TabsTrigger value="manage-products" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900 data-[state=active]:text-amber-600">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Manage</span>
            </TabsTrigger>
            <TabsTrigger value="blogs" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-stone-900 data-[state=active]:text-amber-600">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Blogs</span>
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
          <TabsContent value="blogs">
            <ManageBlogsTab />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
