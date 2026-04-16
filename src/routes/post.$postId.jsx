import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import { DEMO_POSTS, DEMO_REVIEWS, DEMO_COMMENTS } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import { ThumbsUp, ThumbsDown, Clock, UserCircle, Star, Send, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
export const Route = createFileRoute("/post/$postId")({
  component: SinglePostPage,
  head: ({ params }) => {
    const post = DEMO_POSTS.find((p) => p.id === params.postId);
    return {
      meta: [
        { title: post ? `${post.title} — AnonReview` : "Post Not Found" },
        { name: "description", content: post?.content.slice(0, 155) || "" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Post Not Found</h1>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          Go Home
        </Link>
      </div>
    </div>
  ),
});
function SinglePostPage() {
  const { user } = useAuth();
  const { postId } = Route.useParams();
  const canComment = user?.role === "reviewer" || user?.role === "admin";
  const post = DEMO_POSTS.find((p) => p.id === postId);
  const reviews = DEMO_REVIEWS.filter((r) => r.postId === postId);
  const comments = DEMO_COMMENTS.filter((c) => c.postId === postId);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Post Not Found</h1>
            <Link to="/" className="mt-4 inline-block text-primary hover:underline">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          {/* Post */}
          <article>
            <FadeIn>
              <div className="mb-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-bold leading-tight">{post.title}</h1>
              <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                    {post.authorName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  {post.authorName}
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {post.createdAt}
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="mt-6 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
                {post.content}
              </div>

              <div className="mt-6 flex items-center gap-4 border-t border-border pt-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  suppressHydrationWarning
                  onClick={() => {
                    setLiked(!liked);
                    setDisliked(false);
                    toast(liked ? "Like removed" : "Post liked!");
                  }}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${liked ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-primary"}`}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {post.likes + (liked ? 1 : 0)}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  suppressHydrationWarning
                  onClick={() => {
                    setDisliked(!disliked);
                    setLiked(false);
                    toast(disliked ? "Dislike removed" : "Post disliked");
                  }}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${disliked ? "bg-destructive/15 text-destructive" : "text-muted-foreground hover:text-destructive"}`}
                >
                  <ThumbsDown className="h-4 w-4" />
                  {post.dislikes + (disliked ? 1 : 0)}
                </motion.button>
              </div>
            </FadeIn>
          </article>

          {/* Anonymous Reviews */}
          {reviews.length > 0 && (
            <section className="mt-10">
              <FadeIn delay={0.25}>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Star className="h-5 w-5 text-warning" />
                  Anonymous Reviews ({reviews.length})
                </h2>
              </FadeIn>
              <StaggerContainer className="flex flex-col gap-3" staggerDelay={0.08}>
                {reviews.map((review) => (
                  <StaggerItem key={review.id}>
                    <div className="glass-card rounded-lg p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                            ?
                          </div>
                          <span className="text-sm font-medium">Anonymous</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < review.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80">{review.content}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{review.createdAt}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </section>
          )}

          {/* Comments */}
          <section className="mt-10">
            <FadeIn delay={0.3}>
              <h2 className="mb-4 text-lg font-semibold">Comments ({comments.length})</h2>

              {canComment ? (
                <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="h-10 flex-1 rounded-md border border-border bg-input px-3 text-sm placeholder:text-muted-foreground focus:outline-none input-glow"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    suppressHydrationWarning
                    onClick={() => {
                      if (newComment.trim()) {
                        toast.success("Comment added!");
                        setNewComment("");
                      }
                    }}
                    className="flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:justify-start"
                  >
                    <Send className="h-3.5 w-3.5" />
                    Post
                  </motion.button>
                </div>
              ) : (
                <div className="mb-6 rounded-lg bg-secondary/50 p-4 text-center">
                  <ShieldAlert className="mx-auto mb-2 h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Only <span className="font-semibold text-primary">Reviewers</span> can post comments and reviews.
                  </p>
                  <Link 
                    to="/apply-reviewer" 
                    className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
                  >
                    Apply to become a Reviewer →
                  </Link>
                </div>
              )}
            </FadeIn>

            <StaggerContainer className="flex flex-col gap-3" staggerDelay={0.06}>
              {comments.map((comment) => (
                <StaggerItem key={comment.id}>
                  <div className="glass-card rounded-lg p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <UserCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{comment.authorName}</span>
                      <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-foreground/80">{comment.content}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
