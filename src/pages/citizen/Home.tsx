import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-context";
import { ReportCard } from "@/components/ReportCard";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, TrendingUp, MapPin } from "lucide-react";

export default function CitizenHome() {
  const { user, reports } = useApp();
  const mine = reports.filter((r) => r.reporterId === "u-citizen");
  const recent = mine.slice(0, 3);

  const stats = {
    total: mine.length,
    inProgress: mine.filter((r) => r.status === "in_progress").length,
    resolved: mine.filter((r) => r.status === "done").length,
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-3xl gradient-hero p-6 text-primary-foreground shadow-glow">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-primary-glow/40 blur-3xl" />
        <div className="relative">
          <div className="text-xs font-semibold uppercase tracking-wider opacity-80">{greeting}</div>
          <h1 className="text-2xl font-extrabold mt-1">Hi, {user?.name.split(" ")[0]} 👋</h1>
          <p className="text-sm opacity-85 mt-1.5 max-w-xs">
            See something broken? Report it in under a minute and help your neighborhood.
          </p>
          <Link to="/citizen/new">
            <Button variant="accent" size="lg" className="mt-5">
              <Plus className="h-5 w-5" strokeWidth={2.6} />
              Report an issue
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3 mt-5">
        <StatCard label="Submitted" value={stats.total} icon={<Sparkles className="h-4 w-4" />} tint="bg-primary-soft text-primary" />
        <StatCard label="In progress" value={stats.inProgress} icon={<TrendingUp className="h-4 w-4" />} tint="bg-status-progress-soft text-status-progress" />
        <StatCard label="Resolved" value={stats.resolved} icon={<MapPin className="h-4 w-4" />} tint="bg-status-done-soft text-status-done" />
      </section>

      <section className="mt-7">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">Recent reports</h2>
          <Link to="/citizen/reports" className="text-sm font-semibold text-primary hover:underline">
            See all
          </Link>
        </div>
        <div className="space-y-3">
          {recent.map((r) => (
            <ReportCard key={r.id} report={r} to={`/report/${r.id}`} />
          ))}
        </div>
      </section>

      <section className="mt-7 card-elevated p-5 bg-gradient-to-br from-accent-soft to-card">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl gradient-accent flex items-center justify-center text-accent-foreground flex-shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold">Your impact this month</div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {stats.resolved} issue{stats.resolved === 1 ? "" : "s"} fixed thanks to your reports. Keep it up!
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function StatCard({ label, value, icon, tint }: { label: string; value: number; icon: React.ReactNode; tint: string }) {
  return (
    <div className="card-elevated p-3.5">
      <div className={`h-8 w-8 rounded-lg ${tint} flex items-center justify-center`}>{icon}</div>
      <div className="text-2xl font-extrabold mt-2">{value}</div>
      <div className="text-[11px] text-muted-foreground font-medium">{label}</div>
    </div>
  );
}
