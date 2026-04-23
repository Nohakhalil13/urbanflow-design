import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/app-context";
import { DEMO_USERS, Role } from "@/lib/urbanfix-data";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock, ShieldCheck, Wrench, User as UserIcon } from "lucide-react";

const ROLE_META: Record<Role, { label: string; desc: string; icon: typeof UserIcon; tint: string }> = {
  citizen: { label: "Citizen", desc: "Report and track issues", icon: UserIcon, tint: "from-primary to-primary-glow" },
  technician: { label: "Technician", desc: "Resolve assigned tasks", icon: Wrench, tint: "from-accent to-orange-400" },
  admin: { label: "Admin", desc: "Oversee the city", icon: ShieldCheck, tint: "from-emerald-600 to-teal-500" },
};

export default function Login() {
  const navigate = useNavigate();
  const { loginAs } = useApp();
  const [email, setEmail] = useState("citizen@urbanfix.app");
  const [password, setPassword] = useState("urbanfix");

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    const u = DEMO_USERS.find((d) => d.email === email);
    if (!u) {
      toast.error("Account not found. Try a demo account.");
      return;
    }
    loginAs(u);
    toast.success(`Welcome back, ${u.name.split(" ")[0]}`);
    navigate(redirectFor(u.role));
  };

  const handleDemo = (role: Role) => {
    const u = DEMO_USERS.find((d) => d.role === role)!;
    loginAs(u);
    toast.success(`Signed in as ${ROLE_META[role].label}`);
    navigate(redirectFor(role));
  };

  return (
    <div className="min-h-screen gradient-soft flex flex-col">
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 animate-fade-in">
            <Logo />
          </div>

          <div className="card-elevated p-8 animate-slide-up">
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Sign in to keep your city moving.
            </p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <Field icon={<Mail className="h-4 w-4" />} label="Email">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@city.com"
                  className="h-12 pl-11 bg-secondary/50 border-transparent focus-visible:bg-card"
                />
              </Field>
              <Field icon={<Lock className="h-4 w-4" />} label="Password">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 pl-11 bg-secondary/50 border-transparent focus-visible:bg-card"
                />
              </Field>

              <div className="flex justify-end">
                <button type="button" className="text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                Sign in <ArrowRight className="h-4 w-4" />
              </Button>
            </form>

            <div className="mt-7 pt-6 border-t border-border">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center">
                Try a demo account
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(ROLE_META) as Role[]).map((role) => {
                  const m = ROLE_META[role];
                  const Icon = m.icon;
                  return (
                    <button
                      key={role}
                      onClick={() => handleDemo(role)}
                      className="group rounded-2xl border border-border p-3 hover:border-primary/50 hover:bg-primary-soft transition-base text-left"
                    >
                      <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${m.tint} text-primary-foreground flex items-center justify-center mb-2 group-hover:scale-110 transition-base`}>
                        <Icon className="h-4 w-4" strokeWidth={2.5} />
                      </div>
                      <div className="font-bold text-sm">{m.label}</div>
                      <div className="text-[10px] text-muted-foreground leading-tight mt-0.5">{m.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New to UrbanFix?{" "}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function redirectFor(role: Role) {
  if (role === "citizen") return "/citizen";
  if (role === "technician") return "/tech";
  return "/admin";
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold text-foreground mb-1.5">{label}</div>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
        {children}
      </div>
    </label>
  );
}
