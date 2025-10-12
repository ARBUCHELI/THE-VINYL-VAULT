import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

const Post = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    
    // Fetch post
    const { data: postData, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:author_id(id, username, avatar_url, full_name, bio),
        categories:category_id(name, slug)
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (postData) {
      setPost(postData);
      
      // Increment views
      await supabase
        .from("posts")
        .update({ views: postData.views + 1 })
        .eq("id", postData.id);
    }
    
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <article className="container mx-auto px-4 py-12 max-w-4xl flex-1">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </article>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center flex-1">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The post you're looking for doesn't exist.</p>
          <Link to="/" className="text-primary hover:underline">Go back to homepage</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <article className="container mx-auto px-4 py-12 max-w-4xl flex-1">
        {/* Post Header */}
        <div className="mb-8">
          {post.categories && (
            <Badge className="mb-4">{post.categories.name}</Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4 text-muted-foreground">
            <div className="flex items-center space-x-4">
              <Link to={`/author/${post.profiles.id}`} className="flex items-center space-x-2 hover:text-primary transition-colors">
                <Avatar>
                  <AvatarImage src={post.profiles.avatar_url || undefined} />
                  <AvatarFallback>
                    {post.profiles.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-foreground">{post.profiles.full_name || post.profiles.username}</div>
                  <div className="text-sm">@{post.profiles.username}</div>
                </div>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {post.cover_image && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Author Bio */}
        <div className="border-t pt-8">
          <h3 className="text-xl font-bold mb-4">About the Author</h3>
          <Link to={`/author/${post.profiles.id}`} className="flex items-start space-x-4 hover:opacity-80 transition-opacity">
            <Avatar className="h-16 w-16">
              <AvatarImage src={post.profiles.avatar_url || undefined} />
              <AvatarFallback>
                {post.profiles.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-lg">{post.profiles.full_name || post.profiles.username}</div>
              <div className="text-muted-foreground">@{post.profiles.username}</div>
              {post.profiles.bio && (
                <p className="text-muted-foreground mt-2">{post.profiles.bio}</p>
              )}
            </div>
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default Post;
