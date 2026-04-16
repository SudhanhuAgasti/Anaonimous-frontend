import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { PageTransition, FadeIn } from "@/components/Animations";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/apply-reviewer")({
  component: ApplyReviewerPage,
});

function ApplyReviewerPage() {
  const { user, becomeReviewer, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    if (user) {
      const apps = JSON.parse(localStorage.getItem("demo_applications") || "[]");
      setSubmitted(apps.some(a => a.userId === user.id && a.status === "pending"));
    }
  }, [user]);
  const [answers, setAnswers] = useState({
    experience: "",
    reason: "",
    quality: "",
  });

  if (authLoading) return null;

  if (!user) {
    navigate({ to: "/login" });
    return null;
  }

  if (user.role === "reviewer" || user.role === "admin") {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center p-20 text-center">
          <ShieldCheck className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-2xl font-bold font-display">You are a Reviewer!</h1>
          <p className="text-muted-foreground mt-2">You have all the permissions to review and comment on posts.</p>
          <button 
            onClick={() => navigate({ to: "/dashboard" })}
            className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all hover:scale-105"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center p-20 text-center">
          <div className="h-16 w-16 animate-pulse bg-warning/20 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="h-8 w-8 text-warning animate-spin" />
          </div>
          <h1 className="text-2xl font-bold font-display">Application Under Review</h1>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Your application to become a reviewer has been submitted to our Admin team. 
            We'll review your answers and update your role soon!
          </p>
          <button 
            onClick={() => navigate({ to: "/dashboard" })}
            className="mt-6 rounded-md bg-secondary px-6 py-2 text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await becomeReviewer(answers);
    setLoading(false);
    if (success) {
      toast.success("Application submitted successfully!");
      setSubmitted(true);
    } else {
      toast.error("Submission failed. Please try again later.");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <FadeIn>
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold font-display">Become a Reviewer</h1>
              <p className="mt-2 text-muted-foreground">
                Reviewers can provide expert feedback and comment on any post. Answer a few questions to qualify.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit} className="glass-card space-y-6 rounded-2xl p-6 sm:p-8">
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">How many years of experience do you have in your field?</label>
                  <textarea
                    required
                    value={answers.experience}
                    onChange={(e) => setAnswers({ ...answers, experience: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input p-3 text-sm focus:outline-none input-glow"
                    placeholder="e.g. 5 years in Full-stack development..."
                    rows={2}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Why do you want to become a reviewer on PeerView?</label>
                  <textarea
                    required
                    value={answers.reason}
                    onChange={(e) => setAnswers({ ...answers, reason: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input p-3 text-sm focus:outline-none input-glow"
                    placeholder="I want to help the community by providing constructive feedback..."
                    rows={3}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">What criteria would you use to judge a high-quality post?</label>
                  <textarea
                    required
                    value={answers.quality}
                    onChange={(e) => setAnswers({ ...answers, quality: e.target.value })}
                    className="w-full rounded-lg border border-border bg-input p-3 text-sm focus:outline-none input-glow"
                    placeholder="Code readability, architecture, performance considerations..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 glow-primary"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Evaluating Qualification...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </FadeIn>
        </main>
      </div>
    </PageTransition>
  );
}
