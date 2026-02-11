import { Link } from "react-router-dom";
import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/dateUtils";

export default function BlogCard({
  id,
  title,
  content,
  imageUrl,
  authorName,
  authorAvatar,
  authorId,
  createdAt,
  likesCount,
  commentsCount,
  isLiked,
}) {
  const initials = authorName
    ? authorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  // Strip HTML tags for excerpt
  const strippedContent = content.replace(/<[^>]*>/g, "");
  const excerpt = strippedContent.slice(0, 160) + (strippedContent.length > 160 ? "..." : "");

  return (
    <article className="group animate-fade-in rounded-lg border border-border bg-card p-0 transition-all hover:shadow-lg hover:shadow-primary/5">
      {imageUrl && (
        <Link to={`/post/${id}`}>
          <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>
      )}
      <div className="p-5">
        <div className="mb-3 flex items-center gap-3">
          <Link to={`/profile/${authorId}`}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={authorAvatar || ""} />
              <AvatarFallback className="bg-secondary text-secondary-foreground text-xs font-body font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-col">
            <Link to={`/profile/${authorId}`} className="text-sm font-semibold font-body text-foreground hover:text-primary transition-colors">
              {authorName || "Anonymous"}
            </Link>
            <span className="text-xs text-muted-foreground font-body">
              {formatDate(createdAt, "MMM d, yyyy")}
            </span>
          </div>
        </div>

        <Link to={`/post/${id}`} className="block">
          <h2 className="mb-2 font-display text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary break-words overflow-hidden">
            {title}
          </h2>
        </Link>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground font-body line-clamp-3 break-words overflow-hidden">
          {excerpt}
        </p>

        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5 text-xs font-body">
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} /> {likesCount}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-body">
            <MessageCircle className="h-4 w-4" /> {commentsCount}
          </span>
        </div>
      </div>
    </article>
  );
}
