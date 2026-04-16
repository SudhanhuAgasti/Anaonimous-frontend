import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { LayoutDashboard, PenSquare, BarChart3, ChevronLeft, ChevronRight, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
const userLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/create-post", label: "Create Post", icon: PenSquare },
];
const adminLinks = [{ to: "/admin", label: "Admin Panel", icon: BarChart3 }];
const reviewerLinks = [{ to: "/dashboard", label: "Reviewer Panel", icon: ShieldCheck }];
const applyLink = { to: "/apply-reviewer", label: "Become Reviewer", icon: Star };
export function DashboardLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const links = (() => {
    if (user?.role === "admin") return [...adminLinks, ...userLinks];
    if (user?.role === "reviewer") return [...reviewerLinks, ...userLinks];
    return [...userLinks, applyLink];
  })();
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      <nav className="border-b border-border bg-sidebar px-3 py-2 lg:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <link.icon className="h-4 w-4 shrink-0" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <aside
        className={`hidden border-r border-border bg-sidebar transition-all duration-300 lg:block ${collapsed ? "w-16" : "w-56"}`}
      >
        <div className="flex h-full flex-col justify-between p-3">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }`}
                >
                  <link.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{link.label}</span>}
                </Link>
              );
            })}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center rounded-md p-2 text-sidebar-foreground/50 hover:bg-sidebar-accent/50"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  );
}
