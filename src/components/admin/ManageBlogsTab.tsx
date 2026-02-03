import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, Trash2, Eye, EyeOff, Plus, X, Upload, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { staticChronicles, Blog as StaticBlog } from "@/data/chronicles";

interface Blog {
  id: string;
  title: string;
  content: string;
  image: string | null;
  published_at: string | null;
  is_published: boolean;
  created_at: string;
  isStatic?: boolean;
}

export function ManageBlogsTab() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // AI Generation state
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatedImagePrompt, setGeneratedImagePrompt] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const generateWithAI = async () => {
    if (!aiTopic.trim()) {
      toast.error("Please enter a topic for the chronicle");
      return;
    }

    setGenerating(true);
    try {
      const response = await supabase.functions.invoke("generate-chronicle", {
        body: { topic: aiTopic, additionalContext: aiContext },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const { chronicle } = response.data;

      // Pre-fill the form with generated content
      setTitle(chronicle.title);
      setContent(chronicle.content);
      setGeneratedImagePrompt(chronicle.image_prompt);
      setShowAIModal(false);
      setShowForm(true);
      setAiTopic("");
      setAiContext("");

      toast.success("Chronicle generated! Review and publish when ready. 📜");
    } catch (error: any) {
      console.error("AI generation error:", error);
      toast.error(`Generation failed: ${error.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const fetchBlogs = async () => {
    // Fetch DB blogs
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    // Convert static chronicles to Blog format
    const staticBlogs: Blog[] = staticChronicles.map(c => ({
      id: c.id,
      title: c.title,
      content: c.content,
      image: c.image,
      published_at: c.published_at,
      is_published: true,
      created_at: c.published_at || new Date().toISOString(),
      isStatic: true,
    }));

    if (error) {
      toast.error("Failed to fetch blogs from database");
      // Still show static chronicles
      setBlogs(staticBlogs);
    } else {
      // Merge: DB blogs first, then static ones
      setBlogs([...(data || []), ...staticBlogs]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setPublishDate("");
    setImageFile(null);
    setImagePreview(null);
    setEditingBlog(null);
    setShowForm(false);
  };

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

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `blog-${Date.now()}.${fileExt}`;
    const filePath = `blogs/${fileName}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (error) {
      toast.error("Failed to upload image");
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);

    try {
      let imageUrl = editingBlog?.image || null;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        if (!imageUrl && imageFile) {
          setSubmitting(false);
          return;
        }
      }

      const blogData = {
        title,
        content,
        image: imageUrl,
        published_at: publish ? (publishDate || new Date().toISOString().split("T")[0]) : null,
        is_published: publish,
        author_id: user.id,
      };

      if (editingBlog) {
        const { error } = await supabase
          .from("blogs")
          .update(blogData)
          .eq("id", editingBlog.id);

        if (error) throw error;
        toast.success(publish ? "Blog published! 📰" : "Blog saved as draft!");
      } else {
        const { error } = await supabase
          .from("blogs")
          .insert([blogData]);

        if (error) throw error;
        toast.success(publish ? "Blog published! 📰" : "Blog saved as draft!");
      }

      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error("Failed to save blog");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setPublishDate(blog.published_at || "");
    setImagePreview(blog.image);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post? 🗑️")) return;

    const { error } = await supabase.from("blogs").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete blog");
    } else {
      toast.success("Blog deleted!");
      fetchBlogs();
    }
  };

  const togglePublish = async (blog: Blog) => {
    const { error } = await supabase
      .from("blogs")
      .update({
        is_published: !blog.is_published,
        published_at: !blog.is_published ? new Date().toISOString().split("T")[0] : null,
      })
      .eq("id", blog.id);

    if (error) {
      toast.error("Failed to update blog");
    } else {
      toast.success(blog.is_published ? "Blog unpublished!" : "Blog published! 📰");
      fetchBlogs();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-display text-2xl">Manage Chronicles 📜</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAIModal(true)}
            className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            disabled={generating}
          >
            <Sparkles className="h-4 w-4" />
            {generating ? "Generating..." : "Generate with AI"}
          </Button>
          <Button
            onClick={() => setShowForm(!showForm)}
            className={showForm ? "gap-2" : "gap-2 bg-amber-600 hover:bg-amber-700 text-white"}
            variant={showForm ? "outline" : "default"}
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? "Cancel" : "New Chronicle"}
          </Button>
        </div>
      </div>

      {/* AI Generation Modal */}
      {showAIModal && (
        <Card className="border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Generate Chronicle with AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ai-topic">Topic / News Event *</Label>
              <Input
                id="ai-topic"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="e.g., Tech layoffs, Return to office mandates, AI taking jobs..."
                disabled={generating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-context">Additional Context (optional)</Label>
              <Textarea
                id="ai-context"
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
                placeholder="Any specific angle, characters to include, or details..."
                rows={3}
                disabled={generating}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAIModal(false)}
                variant="outline"
                disabled={generating}
              >
                Cancel
              </Button>
              <Button
                onClick={generateWithAI}
                disabled={generating || !aiTopic.trim()}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Sparkles className="h-4 w-4" />
                {generating ? "Consulting the Oracle..." : "Generate Chronicle"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Image Prompt Display */}
      {generatedImagePrompt && showForm && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
              🎨 AI Image Prompt (copy to generate image)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-900 dark:text-blue-100 font-mono bg-blue-100 dark:bg-blue-900/50 p-3 rounded">
              {generatedImagePrompt}
            </p>
            <Button
              size="sm"
              variant="ghost"
              className="mt-2 text-blue-600"
              onClick={() => {
                navigator.clipboard.writeText(generatedImagePrompt);
                toast.success("Image prompt copied!");
              }}
            >
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      )}

      {showForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="font-display">
              {editingBlog ? "Edit Chronicle ✏️" : "Create New Chronicle 📜"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Edict Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Proclaim the news from the Forum..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Scroll Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Scribe your chronicle here... The citizens are waiting! 🏛️"
                  rows={10}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Chronicle Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, false)}
                  disabled={submitting || !title || !content}
                >
                  Save as Draft
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={submitting || !title || !content}
                  className="gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Upload className="h-4 w-4" />
                  {submitting ? "Publishing..." : "Publish Now"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <span className="text-5xl mb-4 inline-block">📜</span>
            <p className="text-muted-foreground">
              No chronicles yet... Time to document the empire! 🏛️
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {blog.image && (
                  <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-xl">{blog.title}</h3>
                        {blog.isStatic ? (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                            Static
                          </span>
                        ) : (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${blog.is_published
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                              }`}
                          >
                            {blog.is_published ? "Published" : "Draft"}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {blog.published_at
                          ? `Published: ${format(new Date(blog.published_at), "MMM d, yyyy")}`
                          : `Created: ${format(new Date(blog.created_at), "MMM d, yyyy")}`}
                      </p>
                      <p className="text-muted-foreground line-clamp-2">
                        {blog.content.substring(0, 150)}...
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {!blog.isStatic && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePublish(blog)}
                            title={blog.is_published ? "Unpublish" : "Publish"}
                          >
                            {blog.is_published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(blog)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(blog.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {blog.isStatic && (
                        <span className="text-xs text-muted-foreground italic px-2">
                          Edit in code
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
