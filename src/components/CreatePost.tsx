import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { z } from "zod";

const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  excerpt: z.string().trim().max(500, "Excerpt must be less than 500 characters").optional(),
  content: z.string().trim().min(10, "Content must be at least 10 characters"),
  status: z.enum(["draft", "published"]),
  coverImage: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = postSchema.parse({ 
        title, 
        excerpt, 
        content, 
        status,
        coverImage: coverImage || undefined 
      });
      
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a post");
        return;
      }

      const slug = generateSlug(validated.title);
      
      const { error } = await supabase.from("posts").insert({
        title: validated.title,
        slug,
        excerpt: validated.excerpt || null,
        content: validated.content,
        cover_image: validated.coverImage || null,
        status: validated.status,
        author_id: user.id,
        published_at: validated.status === "published" ? new Date().toISOString() : null,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success(`Post ${validated.status === "published" ? "published" : "saved as draft"} successfully!`);
        setTitle("");
        setExcerpt("");
        setContent("");
        setCoverImage("");
        setStatus("draft");
        
        if (validated.status === "published") {
          navigate(`/post/${slug}`);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to create post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
        <CardDescription>Write and publish your blog post</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary of your post (optional)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content * (Markdown supported)</Label>
            <Textarea
              id="content"
              placeholder="Write your post content in markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="font-mono"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: "draft" | "published") => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Save as Draft</SelectItem>
                <SelectItem value="published">Publish Now</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === "published" ? "Publish Post" : "Save Draft"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
