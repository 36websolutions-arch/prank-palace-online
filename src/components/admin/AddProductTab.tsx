import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ChronicleSpinner } from "@/components/ChronicleLoader";
import { Zap, Package, Upload, X, Image } from "lucide-react";

export function AddProductTab() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    type: "digital",
    description: "",
    digital_content: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.from("products").insert({
      name: form.name,
      price: parseFloat(form.price),
      type: form.type,
      image: imageUrl,
      description: form.description || null,
      digital_content: form.type === "digital" ? form.digital_content : null,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Product Added! 🎉", description: `${form.name} is now available for mischief!` });
      setForm({ name: "", price: "", type: "digital", description: "", digital_content: "" });
      removeImage();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6 max-w-2xl">
      <h2 className="font-display text-2xl text-stone-900 dark:text-stone-100 mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              placeholder="Whoopee Cushion Deluxe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="9.99"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Product Type</Label>
          <Select value={form.type} onValueChange={(value) => setForm({ ...form, type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="digital">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" /> Digital Product
                </div>
              </SelectItem>
              <SelectItem value="physical">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" /> Physical Product
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Product Image</Label>
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 rounded-lg mx-auto"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="cursor-pointer py-8 hover:bg-secondary/50 rounded-lg transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-2">Click to upload product image</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {!imagePreview && (
              <Button
                type="button"
                variant="outline"
                className="mt-4 gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" /> Choose File
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="The ultimate prank for maximum laughs..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>

        {form.type === "digital" && (
          <div className="space-y-2 p-4 bg-secondary rounded-lg border-2 border-dashed border-primary/30">
            <Label htmlFor="digital_content" className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Digital Content (sent via email)
            </Label>
            <Textarea
              id="digital_content"
              placeholder="Enter the digital content, link, or instructions to be sent to customers..."
              value={form.digital_content}
              onChange={(e) => setForm({ ...form, digital_content: e.target.value })}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              This content will be automatically delivered to customers after payment.
            </p>
          </div>
        )}

        <Button type="submit" size="lg" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white">
          {loading ? <ChronicleSpinner /> : "Add Product to Store"}
        </Button>
      </form>
    </div>
  );
}
