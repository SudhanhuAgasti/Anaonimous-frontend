import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PostCard } from "@/components/PostCard";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import { useAuth } from "@/lib/auth-context";
import { DEMO_POSTS, DEMO_REVIEWS } from "@/lib/mock-data";
import { FileText, ThumbsUp, MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: "Dashboard — AnonReview" }],
  }),
});
function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }
  const myPosts = DEMO_POSTS.filter((p) => p.authorId === user?.id);
  const myReviews = DEMO_REVIEWS.filter((r) => myPosts.some((p) => p.id === r.postId));
  const myReviewCount = myReviews.length;
  const totalLikes = myPosts.reduce((acc, p) => acc + p.likes, 0);
  const stats = [
    { label: "My Posts", value: myPosts.length, icon: FileText, color: "text-primary" },
    { label: "Total Likes", value: totalLikes, icon: ThumbsUp, color: "text-success" },
    { label: "Reviews Received", value: myReviewCount, icon: Star, color: "text-warning" },
    { label: "Comments", value: "12", icon: MessageCircle, color: "text-chart-3" },
  ];
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <DashboardLayout>
          <div className="p-4 sm:p-6">
            <FadeIn>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
                <p className="text-sm text-muted-foreground">Here's an overview of your activity</p>
              </div>
            </FadeIn>

            <StaggerContainer className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <StaggerItem key={stat.label}>
                  <motion.div whileHover={{ y: -3 }} className="glass-card rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="mt-2 text-3xl font-bold">{stat.value}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.3}>
              <h2 className="mb-4 text-lg font-semibold">Your Posts</h2>
            </FadeIn>
            {myPosts.length > 0 ? (
              <div className="space-y-4">
                {myPosts.map((post) => (
                  <StaggerItem key={post.id}>
                    <PostCard post={post} />
                  </StaggerItem>
                ))}
              </div>
            ) : (
              <FadeIn delay={0.4}>
                <div className="glass-card rounded-xl p-10 text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-3 font-medium">No posts yet</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first post to get anonymous reviews
                  </p>
                </div>
              </FadeIn>
            )}

            <FadeIn delay={0.5}>
              <h2 className="mb-4 mt-10 text-lg font-semibold">Reviews Received</h2>
            </FadeIn>
            
            {myReviews.length > 0 ? (
              <StaggerContainer className="grid gap-4 sm:grid-cols-2" staggerDelay={0.1}>
                {myReviews.map((review) => {
                  const post = myPosts.find(p => p.id === review.postId);
                  return (
                    <StaggerItem key={review.id}>
                      <div className="glass-card flex flex-col justify-between rounded-xl p-5">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
                            On: {post?.title}
                          </p>
                          <div className="mb-3 flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < review.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`}
                              />
                            ))}
                          </div>
                          <p className="text-sm leading-relaxed text-foreground/80 italic">
                            "{review.content}"
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                          <span>Verified Reviewer</span>
                          <span>{review.createdAt}</span>
                        </div>
                      </div>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            ) : (
              <FadeIn delay={0.6}>
                <div className="glass-card rounded-xl p-8 text-center">
                  <Star className="mx-auto h-8 w-8 text-muted-foreground/30" />
                  <p className="mt-2 text-sm text-muted-foreground">Waiting for your first review...</p>
                </div>
              </FadeIn>
            )}
          </div>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
}
