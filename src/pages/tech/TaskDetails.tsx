import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-context";
import { CATEGORY_META, PRIORITY_META, ReportStatus, timeAgo } from "@/lib/urbanfix-data";
import { StatusPill } from "@/components/StatusPill";
import { MapPreview } from "@/components/MapPreview";
import { cn } from "@/lib/utils";
import { Camera, Check, Loader2, MapPin, Navigation, User } from "lucide-react";
import { toast } from "sonner";

const FLOW: ReportStatus[] = ["pending", "in_progress", "done"];
const FLOW_LABELS: Record<ReportStatus, string> = {
  pending: "Waiting",
  in_progress: "In Progress",
  done: "Done",
};

export default function TaskDetails() {
  const { id } = useParams();
  const { reports, updateStatus } = useApp();
  const navigate = useNavigate();
  const report = reports.find((r) => r.id === id);
  const [afterImage, setAfterImage] = useState<string | null>(report?.afterImage ?? null);
  const [completing, setCompleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!report) {
    return (
      <AppShell back="/tech" title="Not found">
        <div className="card-elevated p-6 text-center">Task not found.</div>
      </AppShell>
    );
  }

  const cat = CATEGORY_META[report.category];
  const pri = PRIORITY_META[report.priority];
  const idx = FLOW.indexOf(report.status);

  const advance = () => {
    if (report.status === "in_progress" && !afterImage) {
      toast.error("Upload an 'after' photo to mark as done");
      return;
    }
    setCompleting(true);
    setTimeout(() => {
      const next = FLOW[Math.min(idx + 1, FLOW.length - 1)];
      updateStatus(report.id, next, next === "done" ? afterImage ?? undefined : undefined);
      toast.success(`Status updated to ${FLOW_LABELS[next]}`);
      setCompleting(false);
    }, 500);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setAfterImage(URL.createObjectURL(f));
    toast.success("After photo added");
  };

  return (
    <AppShell back="/tech" title={report.id}>
      <div className="relative rounded-3xl overflow-hidden h-56 shadow-card">
        <img src={report.beforeImage} className="w-full h-full object-cover" alt={report.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={cn("rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md", cat.tint)}>
            {cat.icon} {cat.label}
          </span>
          <span className={cn("rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md", pri.chip)}>
            {pri.label}
          </span>
        </div>
        <div className="absolute top-4 right-4"><StatusPill status={report.status} className="shadow-md" /></div>
        <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
          <h1 className="text-xl font-extrabold leading-tight">{report.title}</h1>
          <div className="text-xs opacity-90 mt-1 flex items-center gap-1">
            <User className="h-3 w-3" /> {report.reporterName} · {timeAgo(report.createdAt)}
          </div>
        </div>
      </div>

      {/* Status tracker */}
      <section className="card-elevated p-5 mt-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Update status</div>
        <div className="flex items-center justify-between">
          {FLOW.map((s, i) => {
            const active = i <= idx;
            return (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center font-bold transition-base",
                    active ? "gradient-primary text-primary-foreground shadow-glow" : "bg-secondary text-muted-foreground"
                  )}>
                    {active ? <Check className="h-5 w-5" strokeWidth={3} /> : i + 1}
                  </div>
                  <div className={cn("text-[11px] font-bold mt-1.5", active ? "text-primary" : "text-muted-foreground")}>
                    {FLOW_LABELS[s]}
                  </div>
                </div>
                {i < FLOW.length - 1 && (
                  <div className={cn("h-1 flex-1 rounded-full mx-1 transition-base", i < idx ? "bg-primary" : "bg-secondary")} />
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-elevated p-5 mt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</div>
        <p className="text-sm mt-2 leading-relaxed">{report.description}</p>
        <div className="mt-4 flex items-start gap-3 text-sm">
          <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
          <span className="font-medium">{report.location}</span>
        </div>
      </section>

      <section className="mt-4">
        <MapPreview location={report.location} />
        <Button variant="outline" size="lg" className="w-full mt-3">
          <Navigation className="h-4 w-4" /> Open in maps
        </Button>
      </section>

      {/* After photo */}
      {report.status !== "pending" && (
        <section className="mt-5">
          <h3 className="font-bold mb-3">After photo</h3>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {afterImage ? (
            <div className="relative">
              <img src={afterImage} alt="After" className="w-full h-48 object-cover rounded-2xl ring-2 ring-status-done/30" />
              <button onClick={() => fileRef.current?.click()} className="absolute bottom-3 right-3 rounded-full bg-card/95 backdrop-blur px-3 py-1.5 text-xs font-semibold shadow-card">
                Replace
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-36 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-accent hover:text-accent hover:bg-accent-soft transition-base"
            >
              <Camera className="h-6 w-6" />
              <div className="text-sm font-semibold">Upload "after" photo</div>
            </button>
          )}
        </section>
      )}

      {/* Sticky action */}
      {report.status !== "done" && (
        <div className="fixed inset-x-0 bottom-24 z-20 px-5">
          <div className="max-w-3xl mx-auto">
            <Button variant={report.status === "in_progress" ? "accent" : "hero"} size="lg" className="w-full" onClick={advance} disabled={completing}>
              {completing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {report.status === "pending" ? "Start working" : "Mark as done"}
            </Button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
