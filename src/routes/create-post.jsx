import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageTransition, FadeIn } from "@/components/Animations";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export const Route = createFileRoute("/create-post")({
  component: CreatePostPage,
  head: () => ({
    meta: [{ title: "Create Post — AnonReview" }],
  }),
});
function CreatePostPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  if (authLoading) return null;

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Post submitted for review!");
    navigate({ to: "/dashboard" });
  };
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <DashboardLayout>
          <div className="mx-auto w-full max-w-2xl p-4 sm:p-6">
            <FadeIn>
              <h1 className="mb-1 text-2xl font-bold">Create New Post</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Submit your content for anonymous peer review
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Enter a descriptive title"
                    className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm placeholder:text-muted-foreground focus:outline-none input-glow"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Content</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    rows={10}
                    placeholder="Write your content here..."
                    className="w-full rounded-md border border-border bg-input p-3 text-sm placeholder:text-muted-foreground focus:outline-none input-glow"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Tags</label>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="React, TypeScript, Frontend (comma separated)"
                    className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm placeholder:text-muted-foreground focus:outline-none input-glow"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  suppressHydrationWarning
                  className="flex h-10 items-center justify-center rounded-md bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 glow-primary"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit for Review"}
                </button>
              </form>
            </FadeIn>
          </div>
        </DashboardLayout>
      </div>
    </PageTransition>
  );
}
