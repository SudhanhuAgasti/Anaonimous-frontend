import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/Animations";
import { useAuth } from "@/lib/auth-context";
import { Shield, Loader2, User, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export const Route = createFileRoute("/register")({
  component: RegisterPage,
  head: () => ({
    meta: [{ title: "Register — AnonReview" }],
  }),
});
function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rolePreference, setRolePreference] = useState("user");
  const [loading, setLoading] = useState(false);
  if (isAuthenticated) {
    navigate({ to: "/dashboard" });
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, password);
    setLoading(false);
    if (success) {
      if (rolePreference === "reviewer") {
        // Store intent to be a reviewer for this demo
        localStorage.setItem(`reviewer_intent_${email}`, "true");
        toast.success("Account created! Now, let's complete your reviewer application.");
        navigate({ to: "/apply-reviewer" });
      } else {
        toast.success("Account created! Welcome aboard.");
        navigate({ to: "/dashboard" });
      }
    } else {
      toast.error("Registration failed.");
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
              <h1 className="text-2xl font-bold">Create account</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Join the anonymous review community
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm placeholder:text-muted-foreground focus:outline-none input-glow"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
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
                  minLength={6}
                  placeholder="••••••••"
                  className="h-10 w-full rounded-md border border-border bg-input px-3 text-sm placeholder:text-muted-foreground focus:outline-none input-glow"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">I want to join as:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRolePreference("user")}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all ${
                      rolePreference === "user" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <User className={`h-5 w-5 ${rolePreference === "user" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-xs font-semibold">Standard User</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRolePreference("reviewer")}
                    className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all ${
                      rolePreference === "reviewer" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <ShieldCheck className={`h-5 w-5 ${rolePreference === "reviewer" ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-xs font-semibold">Reviewer</span>
                  </button>
                </div>
                {rolePreference === "reviewer" && (
                   <p className="text-[10px] text-muted-foreground leading-tight px-1">
                     * Reviewer role requires answering a few questions and Admin approval before full access.
                   </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                suppressHydrationWarning
                className="flex h-10 items-center justify-center rounded-md bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 glow-primary"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
