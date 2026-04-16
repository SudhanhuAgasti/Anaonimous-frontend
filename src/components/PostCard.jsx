import { Link } from "@tanstack/react-router";
import { ThumbsUp, ThumbsDown, MessageCircle, Clock, Eye } from "lucide-react";
import { ScaleOnHover } from "@/components/Animations";
const statusColors = {
  pending: "bg-warning/15 text-warning",
  reviewed: "bg-chart-1/15 text-chart-1",
  approved: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
};
export function PostCard({ post, onLike, onDislike }) {
  return (
    <ScaleOnHover>
      <div className="glass-card group rounded-xl p-5 transition-all duration-300 hover:border-primary/30">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
              {post.authorName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{post.authorName}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {post.createdAt}
              </p>
            </div>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[post.status] || ""}`}
          >
            {post.status}
          </span>
        </div>

        <Link to="/post/$postId" params={{ postId: post.id }}>
          <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary">
            {post.title}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{post.content}</p>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3">
          <button
            onClick={onLike}
            suppressHydrationWarning
            className={`flex items-center gap-1.5 text-sm transition-colors ${post.userLiked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {post.likes}
          </button>
          <button
            onClick={onDislike}
            suppressHydrationWarning
            className={`flex items-center gap-1.5 text-sm transition-colors ${post.userDisliked ? "text-destructive" : "text-muted-foreground hover:text-destructive"}`}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            {post.dislikes}
          </button>
          <Link
            to="/post/$postId"
            params={{ postId: post.id }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Comments
          </Link>
          <Link
            to="/post/$postId"
            params={{ postId: post.id }}
            className="sm:ml-auto flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </Link>
        </div>
      </div>
    </ScaleOnHover>
  );
}
