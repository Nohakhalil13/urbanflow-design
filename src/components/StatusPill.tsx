import { cn } from "@/lib/utils";
import { ReportStatus, STATUS_META } from "@/lib/urbanfix-data";

export function StatusPill({ status, className }: { status: ReportStatus; className?: string }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        meta.chip,
        className
      )}
    >
      <span className={cn("relative flex h-1.5 w-1.5")}>
        {status !== "done" && (
          <span className={cn("absolute inset-0 rounded-full opacity-60 animate-ping-soft", meta.dot)} />
        )}
        <span className={cn("relative h-1.5 w-1.5 rounded-full", meta.dot)} />
      </span>
      {meta.label}
    </span>
  );
}
