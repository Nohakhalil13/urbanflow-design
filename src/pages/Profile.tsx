import { AppShell, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { Mail, Phone, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <AppShell>
      <PageHeader title="Profile" subtitle="Your UrbanFix account." />

      <section className="card-elevated p-6 text-center">
        <div className={`mx-auto h-20 w-20 rounded-3xl bg-gradient-to-br ${user.avatarColor} flex items-center justify-center text-primary-foreground text-2xl font-extrabold shadow-glow`}>
          {user.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="font-extrabold text-xl mt-3">{user.name}</div>
        <div className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary mt-2 capitalize">
          <Shield className="h-3 w-3" /> {user.role}
        </div>
      </section>

      <section className="card-elevated p-2 mt-4">
        <Row icon={<Mail className="h-4 w-4" />} label="Email" value={user.email} />
        <Row icon={<Phone className="h-4 w-4" />} label="Phone" value={user.phone} />
      </section>

      <Button variant="outline" size="lg" className="w-full mt-5" onClick={() => { logout(); navigate("/"); }}>
        Sign out
      </Button>
    </AppShell>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-3 py-3 border-b border-border last:border-0">
      <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold truncate">{value}</div>
      </div>
    </div>
  );
}
