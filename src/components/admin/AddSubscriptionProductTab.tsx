import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { JokerSpinner } from "@/components/JokerLoader";
import { Upload, X, Image, RefreshCw } from "lucide-react";

interface SubscriptionOption {
  name: string;
  description: string;
  price: string;
}

export function AddSubscriptionProductTab() {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [subscriptions, setSubscriptions] = useState<SubscriptionOption[]>([
    { name: "", description: "", price: "" },
    { name: "", description: "", price: "" },
    { name: "", description: "", price: "" },
  ]);

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

  const updateSubscription = (index: number, field: keyof SubscriptionOption, value: string) => {
    setSubscriptions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate at least one subscription option
    const validSubscriptions = subscriptions.filter(s => s.name && s.price);
    if (validSubscriptions.length === 0) {
      toast({ title: "Error", description: "Add at least one subscription option with name and price", variant: "destructive" });
      return;
    }

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

    const subscriptionOptions = validSubscriptions.map(s => ({
      name: s.name,
      description: s.description,
      price: parseFloat(s.price),
    }));

    const { error } = await supabase.from("products").insert({
      name: productName,
      price: subscriptionOptions[0].price, // Base price (first subscription)
      type: "subscription",
      image: imageUrl,
      description: productDescription || null,
      subscription_options: subscriptionOptions,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Subscription Product Added! 🎉", description: `${productName} is now available!` });
      setProductName("");
      setProductDescription("");
      setSubscriptions([
        { name: "", description: "", price: "" },
        { name: "", description: "", price: "" },
        { name: "", description: "", price: "" },
      ]);
      removeImage();
    }
    setLoading(false);
  };

  return (
    <div className="bg-card rounded-xl border p-6 max-w-3xl">
      <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
        <RefreshCw className="h-6 w-6 text-primary" />
        Add Subscription Product 🔄
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <Label htmlFor="product-name">Product Name</Label>
          <Input
            id="product-name"
            placeholder="Monthly Prank Box"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
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

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="product-description">Product Description</Label>
          <Textarea
            id="product-description"
            placeholder="Describe what makes this subscription special..."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Subscription Options */}
        <div className="space-y-4">
          <Label className="text-lg">Subscription Options</Label>
          <p className="text-sm text-muted-foreground">Add up to 3 subscription tiers. At least one is required.</p>
          
          {subscriptions.map((sub, index) => (
            <div key={index} className="p-4 bg-secondary/50 rounded-lg border space-y-3">
              <h4 className="font-semibold text-primary">Option {index + 1}</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor={`sub-name-${index}`} className="text-xs">Subscription Name</Label>
                  <Input
                    id={`sub-name-${index}`}
                    placeholder="Weekly Plan"
                    value={sub.name}
                    onChange={(e) => updateSubscription(index, "name", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`sub-price-${index}`} className="text-xs">Price ($)</Label>
                  <Input
                    id={`sub-price-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="9.99"
                    value={sub.price}
                    onChange={(e) => updateSubscription(index, "price", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor={`sub-desc-${index}`} className="text-xs">Description</Label>
                <Textarea
                  id={`sub-desc-${index}`}
                  placeholder="What's included in this tier..."
                  value={sub.description}
                  onChange={(e) => updateSubscription(index, "description", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" variant="joker" size="lg" disabled={loading} className="w-full">
          {loading ? <JokerSpinner /> : "Add Subscription Product 🔄"}
        </Button>
      </form>
    </div>
  );
}