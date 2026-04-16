import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { PageTransition, FadeIn, StaggerContainer, StaggerItem } from "@/components/Animations";
import { useAuth } from "@/lib/auth-context";
import { DEMO_POSTS, DEMO_USERS } from "@/lib/mock-data";
import { 
  Users, FileText, ShieldCheck, Trash2, CheckCircle, XCircle, 
  ClipboardCheck, Clock, Mail, Activity, AlertTriangle, ExternalLink,
  BarChart3, Settings, LogOut, LayoutGrid, MessageSquare, Bell, User
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/admin")({
  component: SuperAdminCommandCenter,
  head: () => ({
    meta: [{ title: "Super Admin — PeerView Command Center" }],
  }),
});

function SuperAdminCommandCenter() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [applications, setApplications] = useState([]);
  const [posts, setPosts] = useState(DEMO_POSTS);
  const [users, setUsers] = useState(DEMO_USERS);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const apps = JSON.parse(localStorage.getItem("demo_applications") || "[]");
    setApplications(apps);
  }, []);

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, user, loading, navigate]);

  if (loading || !isAuthenticated || user?.role !== "admin") return null;

  const handleApproveApp = (appId) => {
    const apps = applications.map(a => 
      a.id === appId ? { ...a, status: "approved" } : a
    );
    setApplications(apps);
    localStorage.setItem("demo_applications", JSON.stringify(apps));
    
    // Update user role
    const app = applications.find(a => a.id === appId);
    if (app) {
      setUsers(prev => prev.map(u => u.id === app.userId ? { ...u, role: "reviewer" } : u));
    }
    toast.success("Reviewer application approved!");
  };

  const handleRejectApp = (appId) => {
    const apps = applications.map(a => 
      a.id === appId ? { ...a, status: "rejected" } : a
    );
    setApplications(apps);
    localStorage.setItem("demo_applications", JSON.stringify(apps));
    toast.error("Application rejected");
  };

  const deletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    toast.error("Post deleted");
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.error("User account removed");
  };

  const updatePostStatus = (postId, status) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, status } : p));
    toast.success(`Updated to ${status}`);
  };

  const adminStats = [
    { label: "Total Users", value: users.length, icon: Users, color: "text-sky-400" },
    { label: "Active Posts", value: posts.length, icon: FileText, color: "text-purple-400" },
    { label: "Expert Applicants", value: applications.filter(a => a.status === "pending").length, icon: ShieldCheck, color: "text-amber-400" },
    { label: "Total Interactions", value: posts.reduce((acc, p) => acc + p.likes, 0), icon: Activity, color: "text-emerald-400" },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden h-16 border-b border-white/5 flex items-center justify-between px-4 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-black" />
          </div>
          <span className="font-display font-black text-lg tracking-tighter">COMMAND</span>
        </Link>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white"
        >
          {mobileMenuOpen ? <XCircle className="h-6 w-6" /> : <LayoutGrid className="h-6 w-6" />}
        </button>
      </header>

      {/* Super Admin Vertical Sidebar */}
      <aside className={`
        fixed inset-0 z-40 lg:relative lg:z-0 lg:translate-x-0 transition-transform duration-300 transform
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        w-64 border-r border-white/5 bg-black/90 lg:bg-black/40 backdrop-blur-xl flex flex-col h-screen
      `}>
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 group">
             <div className="h-9 w-9 rounded-xl bg-primary glow-primary flex items-center justify-center transition-transform group-hover:rotate-12">
                <ShieldCheck className="h-5 w-5 text-black" />
             </div>
             <span className="font-display font-black text-xl tracking-tighter text-white">COMMAND</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: "overview", label: "Overview", icon: BarChart3 },
            { id: "posts", label: "Moderation", icon: LayoutGrid },
            { id: "users", label: "Users", icon: Users },
            { id: "apps", label: "Applications", icon: ClipboardCheck },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              suppressHydrationWarning
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? "bg-primary text-black shadow-lg shadow-primary/20" 
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.id === "apps" && applications.filter(a => a.status === "pending").length > 0 && (
                 <span className="ml-auto flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
           <div className="bg-white/5 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                 <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400">SA</div>
                 <div className="min-w-0">
                    <p className="text-xs font-black truncate">SUPER ADMIN</p>
                    <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                 </div>
              </div>
              <button 
                onClick={logout}
                suppressHydrationWarning
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest bg-zinc-800 hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut className="h-3 w-3" /> Terminate Session
              </button>
           </div>
           <p className="text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest">PeerView Kernel v4.0.1</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b]">
        {/* Superior Top Bar - Hidden on Mobile since we have Mobile Header */}
        <header className="hidden lg:flex h-16 border-b border-white/5 items-center justify-between px-8 bg-black/20">
           <div className="flex items-center gap-2">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">System Status:</span>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                 <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-emerald-500 uppercase">Operational</span>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <button className="p-2 text-zinc-500 hover:text-white transition-colors relative">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full border-2 border-[#09090b]" />
              </button>
              <div className="h-8 w-px bg-white/5 mx-2" />
              <p className="text-xs font-bold text-zinc-400">{new Date().toLocaleString()}</p>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
           <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-1">
                     <h2 className="text-4xl font-black tracking-tighter">Command Overview</h2>
                     <p className="text-zinc-500 text-sm">Real-time telemetry and system analytics</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     {adminStats.map((s) => (
                       <div key={s.label} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden group">
                          <div className="flex items-center justify-between mb-4 relative z-10">
                             <div className={`p-3 rounded-2xl bg-black/40 ${s.color}`}>
                                <s.icon className="h-6 w-6" />
                             </div>
                             <span className="text-[10px] font-black text-zinc-600 tracking-widest uppercase">+12% vs last week</span>
                          </div>
                          <div className="relative z-10">
                             <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{s.label}</p>
                             <p className="text-4xl font-black mt-1 leading-none">{s.value}</p>
                          </div>
                          <div className="absolute -bottom-6 -right-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                             <s.icon className="h-32 w-32" />
                          </div>
                       </div>
                     ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2 bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
                        <div className="flex items-center justify-between mb-8">
                           <h3 className="font-black text-xl uppercase tracking-tighter">Active Monitoring</h3>
                           <div className="flex gap-2">
                              <span className="h-2 w-2 rounded-full bg-primary" />
                              <span className="h-2 w-2 rounded-full bg-zinc-800" />
                              <span className="h-2 w-2 rounded-full bg-zinc-800" />
                           </div>
                        </div>
                        <div className="h-64 flex items-end gap-3 px-2">
                           {[40, 70, 45, 90, 65, 80, 55, 75, 50, 85, 95, 60].map((h, i) => (
                              <div key={i} className="flex-1 group relative">
                                 <motion.div 
                                   initial={{ height: 0 }}
                                   animate={{ height: `${h}%` }}
                                   transition={{ delay: i * 0.05 }}
                                   className="w-full bg-primary/20 rounded-t-lg group-hover:bg-primary/40 transition-colors" 
                                 />
                                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-black text-[10px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h}% LOAD
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                     <div className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8">
                        <h3 className="font-black text-xl uppercase tracking-tighter mb-8">System Logs</h3>
                        <div className="space-y-6">
                           {[
                             { log: "Admin authenticated from IP :5173", time: "2m ago", type: "system" },
                             { log: "Post rejection triggered by moderation", time: "15m ago", type: "moderation" },
                             { log: "New reviewer applicant in queue", time: "1h ago", type: "alert" },
                             { log: "Database integrity check complete", time: "4h ago", type: "system" },
                           ].map((l, i) => (
                             <div key={i} className="flex gap-4 items-start">
                                <div className={`h-2 w-2 mt-1.5 rounded-full shrink-0 ${
                                  l.type === 'alert' ? 'bg-amber-500' : 
                                  l.type === 'moderation' ? 'bg-red-500' : 'bg-sky-500'
                                }`} />
                                <div className="space-y-0.5">
                                   <p className="text-xs font-bold leading-tight line-clamp-2">{l.log}</p>
                                   <p className="text-[10px] text-zinc-600 uppercase font-black">{l.time}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "posts" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-8">
                     <div>
                        <h2 className="text-3xl font-black tracking-tight">Content Moderation</h2>
                        <p className="text-zinc-500 text-sm">Force override or approve platform content</p>
                     </div>
                     <div className="bg-white/5 rounded-lg p-1 flex gap-1">
                        <button className="px-3 py-1 bg-zinc-800 rounded-md text-[10px] font-black uppercase">Pending</button>
                        <button className="px-3 py-1 text-zinc-500 text-[10px] font-black uppercase">Live</button>
                     </div>
                  </div>

                  <div className="grid gap-4">
                    {posts.map((p) => (
                       <div key={p.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors hover:bg-zinc-900/60">
                          <div className="min-w-0 max-w-xl">
                             <div className="flex items-center gap-3 mb-2">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                  p.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500' : 
                                  p.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                   {p.status}
                                </span>
                                <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                   <User className="h-2.5 w-2.5" /> {p.authorName}
                                </span>
                             </div>
                             <h4 className="font-bold text-lg mb-1">{p.title}</h4>
                             <p className="text-zinc-500 text-sm line-clamp-1">{p.content}</p>
                          </div>
                          
                          <div className="flex gap-2 shrink-0">
                             <button onClick={() => updatePostStatus(p.id, "approved")} className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">
                                <CheckCircle className="h-5 w-5" />
                             </button>
                             <button onClick={() => updatePostStatus(p.id, "rejected")} className="h-10 w-10 flex items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all">
                                <XCircle className="h-5 w-5" />
                             </button>
                             <Link to={`/post/${p.id}`} className="h-10 w-10 flex items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 hover:bg-sky-500 hover:text-white transition-all">
                                <ExternalLink className="h-5 w-5" />
                             </Link>
                             <button onClick={() => deletePost(p.id)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                                <Trash2 className="h-5 w-5" />
                             </button>
                          </div>
                       </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "users" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col gap-1 mb-8">
                     <h2 className="text-3xl font-black tracking-tight">Identity Management</h2>
                     <p className="text-zinc-500 text-sm">Review authentication logs and authorized entities</p>
                  </div>

                  <div className="bg-zinc-900/40 border border-white/5 rounded-3xl overflow-x-auto">
                     <table className="w-full text-left min-w-[600px]">
                        <thead>
                           <tr className="border-b border-white/5 bg-white/[0.02]">
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Subject</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Directives</th>
                              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Registry Date</th>
                              <th className="px-6 py-4 text-right transition-all"></th>
                           </tr>
                        </thead>
                        <tbody>
                           {users.map((u) => (
                             <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-[10px]">
                                         {u.name[0]}
                                      </div>
                                      <div>
                                         <p className="text-sm font-bold">{u.name}</p>
                                         <p className="text-[10px] text-zinc-500 font-mono">{u.email}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                      u.role === 'admin' ? 'bg-primary text-black' : 
                                      u.role === 'reviewer' ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-800 text-zinc-400'
                                   }`}>
                                      {u.role}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-[10px] text-zinc-500 font-bold tracking-wider">{u.createdAt}</td>
                                <td className="px-6 py-4 text-right">
                                   {u.role !== 'admin' && (
                                     <button onClick={() => deleteUser(u.id)} className="text-zinc-600 hover:text-red-500 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                     </button>
                                   )}
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                </motion.div>
              )}

              {activeTab === "apps" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col gap-1 mb-8">
                     <h2 className="text-3xl font-black tracking-tight">Reviewer Authorization</h2>
                     <p className="text-zinc-500 text-sm">Evaluate credentials for elevated expert roles</p>
                  </div>

                  {applications.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                       {applications.map((app) => (
                         <div key={app.id} className="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 flex flex-col justify-between">
                            <div className="flex items-start justify-between mb-8">
                               <div className="flex items-center gap-4">
                                  <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-black font-black text-xl shadow-lg shadow-primary/20">
                                     {app.userName[0]}
                                  </div>
                                  <div>
                                     <h4 className="font-bold text-xl leading-tight">{app.userName}</h4>
                                     <p className="text-xs text-zinc-500 font-bold flex items-center gap-1.5 mt-0.5">
                                        <Mail className="h-3 w-3" /> {app.userEmail}
                                     </p>
                                  </div>
                               </div>
                               <div className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                 app.status === 'approved' ? 'bg-emerald-500 text-black' : 
                                 app.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-amber-500 text-black animate-pulse'
                               }`}>
                                  {app.status}
                               </div>
                            </div>

                            <div className="space-y-6 flex-1">
                               <div className="space-y-2">
                                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Experience Dossier</p>
                                  <p className="text-sm bg-black/40 rounded-2xl p-4 border border-white/5 leading-relaxed italic text-zinc-300">"{app.experience}"</p>
                               </div>
                               <div className="space-y-2">
                                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Motivation Analysis</p>
                                  <p className="text-sm bg-black/40 rounded-2xl p-4 border border-white/5 leading-relaxed text-zinc-300">"{app.reason}"</p>
                               </div>
                            </div>

                            <div className="pt-8 mt-8 border-t border-white/5 flex gap-3">
                               {app.status === "pending" ? (
                                  <>
                                     <button 
                                       onClick={() => handleApproveApp(app.id)}
                                       className="flex-1 py-3 bg-emerald-500 text-black rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all"
                                     >
                                       Authorize Reviewer
                                     </button>
                                     <button 
                                       onClick={() => handleRejectApp(app.id)}
                                       className="flex-1 py-3 bg-zinc-800 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-500 active:scale-95 transition-all"
                                     >
                                       Decline
                                     </button>
                                  </>
                               ) : (
                                  <div className="w-full text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest py-2">
                                     Authorization Finalized on {new Date(app.submittedAt).toLocaleDateString()}
                                  </div>
                               )}
                            </div>
                         </div>
                       ))}
                    </div>
                  ) : (
                    <div className="py-24 text-center bg-zinc-950 rounded-3xl border-2 border-dashed border-white/5">
                        <ClipboardCheck className="mx-auto h-20 w-20 text-zinc-800" />
                        <h3 className="mt-4 text-xl font-black text-zinc-700">AUTHORIZATION QUEUE CLEAR</h3>
                        <p className="text-sm text-zinc-800 mt-1">No pending expert evaluations detected.</p>
                    </div>
                  )}
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
