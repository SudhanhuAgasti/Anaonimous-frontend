import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/Animations";
import { useAuth } from "@/lib/auth-context";
import { Shield, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [{ title: "Login — AnonReview" }],
  }),
});
function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      const storedUser = JSON.parse(localStorage.getItem("demo_user") || "{}");
      if (storedUser.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/dashboard" });
      }
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) return null;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      toast.success("Welcome back!");
      // Check if this user had a reviewer intent but is still just a 'user'
      const hasReviewerIntent = localStorage.getItem(`reviewer_intent_${email}`);
      const storedUser = JSON.parse(localStorage.getItem("demo_user") || "{}");
      
      if (hasReviewerIntent && storedUser.role === "user") {
        navigate({ to: "/apply-reviewer" });
      } else if (storedUser.role === "admin") {
        navigate({ to: "/admin" }); // Admin goes straight to command center
      } else {
        navigate({ to: "/dashboard" });
      }
    } else {
      toast.error("Invalid credentials. Try admin@anon.com or user@demo.com");
    }
  };
  return (
    <PageTransition>
      <div className="min-h-screen">
        <Navbar />
        <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary glow-primary">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
            </div>

            <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary">
              <p className="font-bold flex items-center gap-1.5 mb-1.5">
                <Shield className="h-3 w-3" /> Dedicated Admin Access:
              </p>
              <div className="space-y-1 pl-4.5 border-l border-primary/20 ml-1.5">
                <p>Email: <span className="font-bold">admin@anon.com</span></p>
                <p>Pass: <span className="font-bold">admin123</span></p>
              </div>
              <p className="mt-2 text-muted-foreground italic font-medium">Standard accounts: user@demo.com (any password)</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@demo.com"
                  className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm placeholder:text-muted-foreground focus:outline-none input-glow"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm placeholder:text-muted-foreground focus:outline-none input-glow"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                className="flex h-10 items-center justify-center rounded-md bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 glow-primary"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
