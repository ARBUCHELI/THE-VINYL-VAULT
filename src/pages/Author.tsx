import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const Author = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchAuthor();
    }
  }, [id]);

  const fetchAuthor = async () => {
    setLoading(true);

    // Fetch author profile
    const { data: authorData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (authorData) {
      setAuthor(authorData);

      // Fetch author's published posts
      const { data: postsData } = await supabase
        .from("posts")
        .select(`
          *,
          profiles:author_id(username, avatar_url, full_name),
          categories:category_id(name, slug)
        `)
        .eq("author_id", id)
        .eq("status", "published")
        .order("published_at", { ascending: false });

      setPosts(postsData || []);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex-1">
          <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center flex-1">
          <h1 className="text-4xl font-bold mb-4">Author Not Found</h1>
          <p className="text-muted-foreground">The author you're looking for doesn't exist.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-1">
        {/* Author Header */}
        <div className="text-center mb-12">
          <Avatar className="h-32 w-32 mx-auto mb-4">
            <AvatarImage src={author.avatar_url || undefined} />
            <AvatarFallback className="text-4xl">
              {author.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <h1 className="text-4xl font-bold mb-2">
            {author.full_name || author.username}
          </h1>
          <p className="text-muted-foreground mb-4">@{author.username}</p>
          
          {author.bio && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {author.bio}
            </p>
          )}
        </div>

        {/* Author's Posts */}
        <div>
          <h2 className="text-2xl font-bold mb-6">
            Posts by {author.full_name || author.username}
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                This author hasn't published any posts yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Author;
