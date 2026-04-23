import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, ClipboardList, PlusCircle, User as UserIcon, ListChecks, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { useApp } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  back?: string;
  rightSlot?: ReactNode;
}

export function AppShell({ children, title, subtitle, back, rightSlot }: AppShellProps) {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const navItems = (() => {
    if (user?.role === "citizen")
      return [
        { to: "/citizen", icon: Home, label: "Home" },
        { to: "/citizen/reports", icon: ClipboardList, label: "Reports" },
        { to: "/citizen/new", icon: PlusCircle, label: "Report", primary: true },
        { to: "/citizen/profile", icon: UserIcon, label: "Profile" },
      ];
    if (user?.role === "technician")
      return [
        { to: "/tech", icon: ListChecks, label: "Tasks" },
        { to: "/tech/profile", icon: UserIcon, label: "Profile" },
      ];
    return [
      { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/admin/profile", icon: UserIcon, label: "Profile" },
    ];
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top header */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border/60">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {back ? (
              <button
                onClick={() => navigate(back)}
                className="h-9 w-9 rounded-full bg-secondary hover:bg-secondary/70 flex items-center justify-center transition-base"
                aria-label="Back"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            ) : (
              <Logo />
            )}
            {title && (
              <div className="min-w-0">
                <div className="font-bold text-base leading-tight truncate">{title}</div>
                {subtitle && <div className="text-xs text-muted-foreground truncate">{subtitle}</div>}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {rightSlot}
            {user && (
              <div className="flex items-center gap-2">
                <div className={cn("h-9 w-9 rounded-full bg-gradient-to-br flex items-center justify-center text-primary-foreground font-bold text-sm shadow-card", user.avatarColor)}>
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-5 py-6 pb-32 animate-fade-in">
        {children}
      </main>

      {/* Bottom nav */}
      {user && (
        <nav className="fixed bottom-0 inset-x-0 z-30 pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-3xl mx-auto px-5 pb-4">
            <div className="bg-card/95 backdrop-blur-xl border border-border/60 rounded-3xl shadow-elevated px-3 py-2 flex items-center justify-around">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    cn(
                      "relative flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-2 min-w-[58px] transition-base",
                      item.primary && "px-4 -mt-6",
                      isActive && !item.primary && "text-primary",
                      !isActive && !item.primary && "text-muted-foreground hover:text-foreground"
                    )
                  }
                >
                  {({ isActive }) =>
                    item.primary ? (
                      <div className="flex flex-col items-center gap-1">
                        <div className="h-14 w-14 rounded-2xl gradient-accent shadow-accent-glow flex items-center justify-center text-accent-foreground transition-base hover:scale-105 active:scale-95">
                          <item.icon className="h-6 w-6" strokeWidth={2.5} />
                        </div>
                        <span className="text-[10px] font-semibold text-accent">{item.label}</span>
                      </div>
                    ) : (
                      <>
                        <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.6 : 2} />
                        <span className={cn("text-[10px] font-semibold", isActive && "text-primary")}>
                          {item.label}
                        </span>
                        {isActive && <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />}
                      </>
                    )
                  }
                </NavLink>
              ))}
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="flex flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-2 min-w-[58px] text-muted-foreground hover:text-destructive transition-base"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-[10px] font-semibold">Exit</span>
              </button>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="card-elevated p-8 text-center flex flex-col items-center gap-3">
      <div className="h-14 w-14 rounded-2xl bg-primary-soft text-primary flex items-center justify-center text-2xl">
        {icon ?? "✨"}
      </div>
      <div className="font-bold">{title}</div>
      {description && <p className="text-sm text-muted-foreground max-w-xs">{description}</p>}
      {action}
    </div>
  );
}

export { Button };
