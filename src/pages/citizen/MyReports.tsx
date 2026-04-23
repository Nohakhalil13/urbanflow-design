import { useState } from "react";
import { AppShell, PageHeader, EmptyState } from "@/components/AppShell";
import { useApp } from "@/lib/app-context";
import { ReportCard } from "@/components/ReportCard";
import { ReportStatus } from "@/lib/urbanfix-data";
import { cn } from "@/lib/utils";

const TABS: { key: ReportStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
];

export default function MyReports() {
  const { reports } = useApp();
  const [tab, setTab] = useState<ReportStatus | "all">("all");

  const mine = reports.filter((r) => r.reporterId === "u-citizen");
  const filtered = tab === "all" ? mine : mine.filter((r) => r.status === tab);

  return (
    <AppShell>
      <PageHeader title="My reports" subtitle="Track every issue you've submitted." />

      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map((t) => {
          const count = t.key === "all" ? mine.length : mine.filter((r) => r.status === t.key).length;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-base flex items-center gap-1.5",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              {t.label}
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                active ? "bg-primary-foreground/20" : "bg-card"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No reports here"
            description="Once you submit a report, it'll show up in this list."
          />
        ) : (
          filtered.map((r) => <ReportCard key={r.id} report={r} to={`/report/${r.id}`} showPriority />)
        )}
      </div>
    </AppShell>
  );
}
