import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppShell, PageHeader } from "@/components/AppShell";
import { useApp } from "@/lib/app-context";
import { CATEGORY_META, PRIORITY_META, ReportStatus, TECHNICIANS, timeAgo } from "@/lib/urbanfix-data";
import { StatusPill } from "@/components/StatusPill";
import { cn } from "@/lib/utils";
import { ClipboardList, Clock4, CheckCircle2, AlertTriangle, Search, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { reports, assignTechnician } = useApp();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReportStatus>("all");

  const stats = useMemo(() => ({
    total: reports.length,
    pending: reports.filter((r) => r.status === "pending").length,
    inProgress: reports.filter((r) => r.status === "in_progress").length,
    resolved: reports.filter((r) => r.status === "done").length,
    highPriority: reports.filter((r) => r.priority === "high" && r.status !== "done").length,
  }), [reports]);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !r.location.toLowerCase().includes(q) && !r.id.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [reports, query, statusFilter]);

  return (
    <AppShell>
      <PageHeader title="Operations" subtitle="City-wide overview of every report and team." />

      {/* Analytics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <BigStat label="Total reports" value={stats.total} icon={<ClipboardList className="h-5 w-5" />} tint="bg-primary-soft text-primary" />
        <BigStat label="Pending" value={stats.pending} icon={<Clock4 className="h-5 w-5" />} tint="bg-status-pending-soft text-status-pending" />
        <BigStat label="In progress" value={stats.inProgress} icon={<AlertTriangle className="h-5 w-5" />} tint="bg-status-progress-soft text-status-progress" />
        <BigStat label="Resolved" value={stats.resolved} icon={<CheckCircle2 className="h-5 w-5" />} tint="bg-status-done-soft text-status-done" />
      </section>

      {/* Hero metric */}
      <section className="mt-4 card-elevated p-5 bg-gradient-to-br from-accent-soft via-card to-card flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl gradient-accent text-accent-foreground flex items-center justify-center shadow-accent-glow">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="text-sm text-muted-foreground">High-priority items needing attention</div>
          <div className="text-2xl font-extrabold mt-0.5">{stats.highPriority} active</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold text-primary">
            {Math.round((stats.resolved / Math.max(stats.total, 1)) * 100)}%
          </div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Resolved</div>
        </div>
      </section>

      {/* Filters */}
      <section className="mt-7 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID, title, location…"
            className="h-11 pl-10 bg-card border-border"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="h-11 sm:w-44 bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In progress</SelectItem>
            <SelectItem value="done">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </section>

      {/* Table — mobile cards / desktop table */}
      <section className="mt-4 card-elevated overflow-hidden">
        <div className="hidden md:grid md:grid-cols-[110px_1fr_140px_120px_180px_60px] gap-3 px-5 py-3 bg-secondary/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
          <div>ID</div>
          <div>Issue</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Technician</div>
          <div></div>
        </div>
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">No reports match your filters.</div>
          ) : (
            filtered.map((r) => {
              const cat = CATEGORY_META[r.category];
              const pri = PRIORITY_META[r.priority];
              return (
                <div key={r.id} className="md:grid md:grid-cols-[110px_1fr_140px_120px_180px_60px] gap-3 px-5 py-4 items-center hover:bg-secondary/30 transition-base">
                  <div className="font-mono text-xs font-bold text-muted-foreground">{r.id}</div>
                  <div className="mt-2 md:mt-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-7 w-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0", cat.tint)}>
                        {cat.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-sm truncate">{r.title}</div>
                        <div className="text-xs text-muted-foreground truncate">{r.location} · {timeAgo(r.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-bold", pri.chip)}>{pri.label}</span>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <StatusPill status={r.status} />
                  </div>
                  <div className="mt-2 md:mt-0">
                    <Select
                      value={r.technicianId ?? ""}
                      onValueChange={(v) => {
                        const tech = TECHNICIANS.find((t) => t.id === v);
                        if (tech) {
                          assignTechnician(r.id, tech.id, tech.name);
                          toast.success(`Assigned to ${tech.name}`);
                        }
                      }}
                    >
                      <SelectTrigger className="h-9 text-xs bg-secondary/40 border-transparent">
                        <SelectValue placeholder="Assign…" />
                      </SelectTrigger>
                      <SelectContent>
                        {TECHNICIANS.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Link to={`/report/${r.id}`} className="mt-2 md:mt-0 inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-base">
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </section>
    </AppShell>
  );
}

function BigStat({ label, value, icon, tint }: { label: string; value: number; icon: React.ReactNode; tint: string }) {
  return (
    <div className="card-elevated p-4">
      <div className={`h-10 w-10 rounded-xl ${tint} flex items-center justify-center`}>{icon}</div>
      <div className="text-3xl font-extrabold mt-3">{value}</div>
      <div className="text-xs text-muted-foreground font-semibold mt-0.5">{label}</div>
    </div>
  );
}
