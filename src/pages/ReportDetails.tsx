import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/lib/app-context";
import { CATEGORY_META, PRIORITY_META, STATUS_META, timeAgo } from "@/lib/urbanfix-data";
import { StatusPill } from "@/components/StatusPill";
import { MapPreview } from "@/components/MapPreview";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, User, Wrench } from "lucide-react";

export default function ReportDetails() {
  const { id } = useParams();
  const { reports, user } = useApp();
  const navigate = useNavigate();
  const report = reports.find((r) => r.id === id);

  if (!report) {
    return (
      <AppShell back="/citizen" title="Not found">
        <div className="card-elevated p-8 text-center">
          <div className="text-4xl">🤔</div>
          <h2 className="font-bold mt-3">Report not found</h2>
          <Button className="mt-4" onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </AppShell>
    );
  }

  const cat = CATEGORY_META[report.category];
  const pri = PRIORITY_META[report.priority];

  const backFor =
    user?.role === "technician" ? "/tech" :
    user?.role === "admin" ? "/admin" :
    "/citizen/reports";

  // Timeline
  const steps = [
    { key: "submitted", label: "Submitted", time: report.createdAt, done: true },
    { key: "assigned", label: report.technicianName ? `Assigned to ${report.technicianName}` : "Awaiting assignment", time: report.technicianName ? report.updatedAt : null, done: !!report.technicianName },
    { key: "progress", label: "Work in progress", time: report.status !== "pending" ? report.updatedAt : null, done: report.status === "in_progress" || report.status === "done" },
    { key: "done", label: "Resolved", time: report.status === "done" ? report.updatedAt : null, done: report.status === "done" },
  ];

  return (
    <AppShell back={backFor} title={report.id}>
      <div className="relative rounded-3xl overflow-hidden h-60 shadow-card">
        <img src={report.beforeImage} alt={report.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn("rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md", cat.tint)}>
            {cat.icon} {cat.label}
          </span>
          <span className={cn("rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md", pri.chip)}>
            {pri.label}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <StatusPill status={report.status} className="shadow-md" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
          <h1 className="text-xl font-extrabold leading-tight">{report.title}</h1>
        </div>
      </div>

      <section className="card-elevated p-5 mt-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</div>
        <p className="text-sm mt-2 leading-relaxed">{report.description}</p>

        <div className="grid grid-cols-1 gap-3 mt-5">
          <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={report.location} />
          <InfoRow icon={<Calendar className="h-4 w-4" />} label="Reported" value={`${timeAgo(report.createdAt)} by ${report.reporterName}`} />
          {report.technicianName && (
            <InfoRow icon={<Wrench className="h-4 w-4" />} label="Technician" value={report.technicianName} />
          )}
        </div>
      </section>

      <section className="mt-5">
        <h3 className="font-bold mb-3">Location</h3>
        <MapPreview location={report.location} />
      </section>

      {report.afterImage && (
        <section className="mt-5">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            After repair
            <span className="rounded-full bg-status-done-soft text-status-done px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              Resolved
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Before</div>
              <img src={report.beforeImage} className="w-full h-32 object-cover rounded-xl" alt="Before" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-status-done mb-1.5">After</div>
              <img src={report.afterImage} className="w-full h-32 object-cover rounded-xl ring-2 ring-status-done/30" alt="After" />
            </div>
          </div>
        </section>
      )}

      <section className="mt-5 card-elevated p-5">
        <h3 className="font-bold mb-4">Progress</h3>
        <ol className="relative">
          {steps.map((s, i) => (
            <li key={s.key} className="flex gap-3 pb-5 last:pb-0 relative">
              {i < steps.length - 1 && (
                <span className={cn(
                  "absolute left-[11px] top-6 bottom-0 w-0.5",
                  s.done ? "bg-primary" : "bg-border"
                )} />
              )}
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-base",
                s.done ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                {s.done ? (
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </div>
              <div className="flex-1 -mt-0.5">
                <div className={cn("text-sm font-semibold", !s.done && "text-muted-foreground")}>{s.label}</div>
                {s.time && <div className="text-xs text-muted-foreground mt-0.5">{timeAgo(s.time)}</div>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </AppShell>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg bg-primary-soft text-primary flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">{label}</div>
        <div className="text-sm font-semibold mt-0.5">{value}</div>
      </div>
    </div>
  );
}
