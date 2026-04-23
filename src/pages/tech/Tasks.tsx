import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useApp } from "@/lib/app-context";
import { ReportCard } from "@/components/ReportCard";
import { Priority, ReportStatus } from "@/lib/urbanfix-data";
import { cn } from "@/lib/utils";
import { TrendingUp, CheckCircle2, Clock } from "lucide-react";

const PRIORITY_ORDER: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
const TABS: { key: "active" | ReportStatus; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "pending", label: "New" },
  { key: "in_progress", label: "Working" },
  { key: "done", label: "Completed" },
];

export default function TechTasks() {
  const { reports, user } = useApp();
  const [tab, setTab] = useState<"active" | ReportStatus>("active");

  const myTasks = useMemo(() => {
    // Show tasks assigned to me + unassigned high priority ones
    return reports.filter((r) => r.technicianId === user?.id || (!r.technicianId && r.priority === "high"));
  }, [reports, user]);

  const filtered = useMemo(() => {
    let list = myTasks;
    if (tab === "active") list = myTasks.filter((r) => r.status !== "done");
    else list = myTasks.filter((r) => r.status === tab);
    return [...list].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  }, [myTasks, tab]);

  const stats = {
    active: myTasks.filter((r) => r.status !== "done").length,
    inProgress: myTasks.filter((r) => r.status === "in_progress").length,
    completed: myTasks.filter((r) => r.status === "done").length,
  };

  return (
    <AppShell>
      <PageHeader title={`Hi, ${user?.name.split(" ")[0]} 👷`} subtitle="Your tasks for today, sorted by priority." />

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Active" value={stats.active} icon={<TrendingUp className="h-4 w-4" />} tint="bg-accent-soft text-accent" />
        <Stat label="In progress" value={stats.inProgress} icon={<Clock className="h-4 w-4" />} tint="bg-status-progress-soft text-status-progress" />
        <Stat label="Done" value={stats.completed} icon={<CheckCircle2 className="h-4 w-4" />} tint="bg-status-done-soft text-status-done" />
      </div>

      <div className="flex gap-1.5 mt-6 mb-4 overflow-x-auto -mx-1 px-1">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-base",
                active ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card-elevated p-8 text-center">
            <div className="text-3xl">🎉</div>
            <div className="font-bold mt-2">All caught up!</div>
            <p className="text-sm text-muted-foreground mt-1">No tasks in this view.</p>
          </div>
        ) : (
          filtered.map((r) => <ReportCard key={r.id} report={r} to={`/tech/task/${r.id}`} showPriority showReporter />)
        )}
      </div>
    </AppShell>
  );
}

function Stat({ label, value, icon, tint }: { label: string; value: number; icon: React.ReactNode; tint: string }) {
  return (
    <div className="card-elevated p-3.5">
      <div className={`h-8 w-8 rounded-lg ${tint} flex items-center justify-center`}>{icon}</div>
      <div className="text-2xl font-extrabold mt-2">{value}</div>
      <div className="text-[11px] text-muted-foreground font-medium">{label}</div>
    </div>
  );
}
