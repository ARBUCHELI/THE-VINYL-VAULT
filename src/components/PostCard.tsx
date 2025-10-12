import { Link } from "react-router-dom";
import { Calendar, User, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    cover_image: string | null;
    published_at: string;
    views: number;
    profiles: {
      username: string;
      avatar_url: string | null;
      full_name: string | null;
    };
    categories: {
      name: string;
      slug: string;
    } | null;
  };
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link to={`/post/${post.slug}`}>
        {post.cover_image && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.categories && (
              <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm">
                {post.categories.name}
              </Badge>
            )}
          </div>
        )}
        <CardHeader>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {post.profiles.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs">{post.profiles.username}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span className="text-xs">
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span className="text-xs">{post.views}</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default PostCard;
