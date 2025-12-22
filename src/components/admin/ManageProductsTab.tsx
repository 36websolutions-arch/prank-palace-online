import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JokerLoader, JokerSpinner } from "@/components/JokerLoader";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2, Zap, Package, Upload, X, Image } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  type: string;
  image: string | null;
  description: string | null;
  digital_content: string | null;
  created_at: string;
}

export function ManageProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "digital" | "physical">("all");
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted!", description: "Product removed from store" });
      fetchProducts();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeNewImage = () => {
    setNewImageFile(null);
    setNewImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    setEditLoading(true);

    let imageUrl = editProduct.image;
    
    if (newImageFile) {
      const uploadedUrl = await uploadImage(newImageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
        setEditLoading(false);
        return;
      }
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: editProduct.name,
        price: editProduct.price,
        type: editProduct.type,
        image: imageUrl,
        description: editProduct.description,
        digital_content: editProduct.type === "digital" ? editProduct.digital_content : null,
      })
      .eq("id", editProduct.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Updated! 🎉", description: "Product changes saved" });
      setEditProduct(null);
      removeNewImage();
      fetchProducts();
    }
    setEditLoading(false);
  };

  const openEditDialog = (product: Product) => {
    setEditProduct(product);
    setNewImageFile(null);
    setNewImagePreview(null);
  };

  const filteredProducts = filter === "all" ? products : products.filter(p => p.type === filter);

  if (loading) return <JokerLoader />;

  return (
    <div className="bg-card rounded-xl border p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-display text-2xl">Manage Products 🎪</h2>
        <div className="flex gap-2">
          {(["all", "digital", "physical"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "digital" ? "⚡ Digital" : "📦 Physical"}
            </Button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <EmptyState icon="🎭" title="No products yet..." description="Add some pranks to sell!" />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-secondary rounded-xl p-4 border">
              <div className="aspect-video bg-background rounded-lg mb-3 flex items-center justify-center text-4xl overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  product.type === "digital" ? "💻" : "📦"
                )}
              </div>
              <Badge variant={product.type === "digital" ? "default" : "secondary"} className="mb-2">
                {product.type === "digital" ? <><Zap className="h-3 w-3 mr-1" /> Digital</> : <><Package className="h-3 w-3 mr-1" /> Physical</>}
              </Badge>
              <h3 className="font-semibold mb-1">{product.name}</h3>
              <p className="text-xl font-bold text-primary mb-3">${Number(product.price).toFixed(2)}</p>
              
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(product)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">Edit Product</DialogTitle>
                    </DialogHeader>
                    {editProduct && (
                      <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Price ($)</Label>
                          <Input type="number" step="0.01" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) })} required />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={editProduct.type} onValueChange={(value) => setEditProduct({ ...editProduct, type: value })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="digital">Digital</SelectItem>
                              <SelectItem value="physical">Physical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Image Upload */}
                        <div className="space-y-2">
                          <Label>Product Image</Label>
                          <div className="border-2 border-dashed border-border rounded-lg p-4">
                            {newImagePreview || editProduct.image ? (
                              <div className="relative inline-block w-full">
                                <img
                                  src={newImagePreview || editProduct.image || ""}
                                  alt="Preview"
                                  className="max-h-32 rounded-lg mx-auto"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute -top-2 -right-2 h-6 w-6"
                                  onClick={() => {
                                    removeNewImage();
                                    setEditProduct({ ...editProduct, image: null });
                                  }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">No image</p>
                              </div>
                            )}
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="w-full mt-3 gap-2"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-4 w-4" /> Upload New Image
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea value={editProduct.description || ""} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} />
                        </div>
                        {editProduct.type === "digital" && (
                          <div className="space-y-2">
                            <Label>Digital Content</Label>
                            <Textarea value={editProduct.digital_content || ""} onChange={(e) => setEditProduct({ ...editProduct, digital_content: e.target.value })} />
                          </div>
                        )}
                        <Button type="submit" variant="joker" className="w-full" disabled={editLoading}>
                          {editLoading ? <JokerSpinner /> : "Save Changes"}
                        </Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
