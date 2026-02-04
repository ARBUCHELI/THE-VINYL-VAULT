import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Eye, Edit, Bold, Italic, Heading1, Heading2, List, Link as LinkIcon, Code } from "lucide-react";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  excerpt: z.string().trim().max(500, "Excerpt must be less than 500 characters").optional(),
  content: z.string().trim().min(10, "Content must be at least 10 characters"),
  status: z.enum(["draft", "published"]),
  coverImage: z.string().url("Invalid URL").optional().or(z.literal("")),
});

interface CreatePostProps {
  editPostId?: string;
  onPostSaved?: () => void;
}

const CreatePost = ({ editPostId, onPostSaved }: CreatePostProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const isEditing = !!editPostId;

  useEffect(() => {
    if (editPostId) {
      fetchPost(editPostId);
    } else {
      // Reset form when switching to create mode
      setTitle("");
      setExcerpt("");
      setContent("");
      setCoverImage("");
      setStatus("draft");
    }
  }, [editPostId]);

  const fetchPost = async (postId: string) => {
    setLoadingPost(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title || "");
        setExcerpt(data.excerpt || "");
        setContent(data.content || "");
        setCoverImage(data.cover_image || "");
        setStatus(data.status || "draft");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load post");
    } finally {
      setLoadingPost(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const insertMarkdown = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newContent = 
      content.substring(0, start) + 
      before + textToInsert + after + 
      content.substring(end);
    
    setContent(newContent);
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
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
        toast.error("You must be logged in to " + (isEditing ? "update" : "create") + " a post");
        return;
      }

      const slug = generateSlug(validated.title);
      
      if (isEditing && editPostId) {
        // Update existing post
        const updateData: any = {
          title: validated.title,
          slug,
          excerpt: validated.excerpt || null,
          content: validated.content,
          cover_image: validated.coverImage || null,
          status: validated.status,
        };

        // Only update published_at if status is changing to published
        if (validated.status === "published") {
          updateData.published_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from("posts")
          .update(updateData)
          .eq("id", editPostId);

        if (error) {
          toast.error(error.message);
        } else {
          toast.success(`Post ${validated.status === "published" ? "published" : "updated"} successfully!`);
          onPostSaved?.();
          
          if (validated.status === "published") {
            navigate(`/post/${slug}`);
          }
        }
      } else {
        // Create new post
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
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to " + (isEditing ? "update" : "create") + " post");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingPost) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Post" : "Create New Post"}</CardTitle>
        <CardDescription>
          {isEditing ? "Update your blog post" : "Write and publish your blog post"}
        </CardDescription>
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
            
            {/* Markdown Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border rounded-t-lg bg-muted/50">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("# ", "", "Heading 1")}
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("## ", "", "Heading 2")}
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("**", "**", "bold text")}
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("*", "*", "italic text")}
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("\n- ", "", "List item")}
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("[", "](url)", "link text")}
                title="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertMarkdown("`", "`", "code")}
                title="Inline Code"
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>

            {/* Editor with Preview Tabs */}
            <Tabs defaultValue="write" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-t-none border-t-0">
                <TabsTrigger value="write">
                  <Edit className="h-4 w-4 mr-2" />
                  Write
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="write" className="mt-0">
                <Textarea
                  id="content"
                  placeholder="Write your post content in markdown...\n\n**Example:**\n# Main Title\n## Subtitle\n**Bold text** and *italic text*\n- List item 1\n- List item 2"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="font-mono rounded-t-none border-t-0 resize-none"
                  required
                />
              </TabsContent>
              
              <TabsContent value="preview" className="mt-0">
                <div className="min-h-[500px] p-4 border rounded-b-lg bg-background">
                  {content ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-20">
                      Nothing to preview yet. Start writing in the Write tab.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
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
            {isEditing 
              ? (status === "published" ? "Update & Publish" : "Update Draft")
              : (status === "published" ? "Publish Post" : "Save Draft")
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
