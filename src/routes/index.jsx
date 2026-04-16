import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import { DEMO_POSTS } from "@/lib/mock-data";
import { Search, TrendingUp, Users, FileText, Shield } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "AnonReview — Anonymous Peer Review Platform" },
      {
        name: "description",
        content: "Submit content for anonymous peer review. Get honest, unbiased feedback.",
      },
    ],
  }),
});
function HomePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const publicPosts = DEMO_POSTS.filter((p) => p.status === "approved" || p.status === "reviewed");
  const filtered = publicPosts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" || p.tags.some((t) => t.toLowerCase() === filter.toLowerCase());
    return matchSearch && matchFilter;
  });
  const allTags = [...new Set(publicPosts.flatMap((p) => p.tags))];
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.15_185/8%),transparent_60%)]" />
          <div className="dark:bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.15_185/8%),transparent_60%)] absolute inset-0" />
          <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 md:py-20">
            <FadeIn>
              <div className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Shield className="h-4 w-4" />
                Anonymous & Unbiased Reviews
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Honest Feedback, <span className="gradient-text">Impartial Evaluation</span>
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                Submit your work for anonymous peer review. Get genuine, constructive feedback
                without the influence of identity or reputation.
              </p>
            </FadeIn>

            <StaggerContainer
              className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
              staggerDelay={0.1}
            >
              {[
                { icon: FileText, label: "Posts", value: DEMO_POSTS.length.toString() },
                { icon: Users, label: "Reviewers", value: "Anonymous" },
                { icon: TrendingUp, label: "Reviews", value: "Unbiased" },
              ].map((stat) => (
                <StaggerItem key={stat.label}>
                  <div className="glass-card flex items-center gap-3 rounded-lg p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-lg font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* Posts */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <FadeIn>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold">Published Posts</h2>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search posts..."
                    className="h-9 w-full rounded-md border border-border bg-input pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none input-glow sm:w-64"
                    suppressHydrationWarning
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="h-9 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground focus:outline-none input-glow sm:w-44"
                  suppressHydrationWarning
                >
                  <option value="all">All Tags</option>
                  {allTags.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </FadeIn>

          <StaggerContainer
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.08}
          >
            {filtered.map((post) => (
              <StaggerItem key={post.id}>
                <PostCard post={post} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center text-muted-foreground"
            >
              No posts found matching your criteria.
            </motion.div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
