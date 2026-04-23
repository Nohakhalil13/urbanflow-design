import { Link } from "react-router-dom";
import { CATEGORY_META, PRIORITY_META, Report, timeAgo } from "@/lib/urbanfix-data";
import { StatusPill } from "./StatusPill";
import { cn } from "@/lib/utils";

interface ReportCardProps {
  report: Report;
  to: string;
  showPriority?: boolean;
  showReporter?: boolean;
}

export function ReportCard({ report, to, showPriority, showReporter }: ReportCardProps) {
  const cat = CATEGORY_META[report.category];
  const pri = PRIORITY_META[report.priority];

  return (
    <Link
      to={to}
      className="card-elevated group block overflow-hidden hover:shadow-elevated hover:-translate-y-0.5 transition-smooth"
    >
      <div className="flex gap-4 p-3.5">
        <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
          <img src={report.beforeImage} alt={report.title} className="h-full w-full object-cover group-hover:scale-105 transition-smooth" loading="lazy" />
          <div className={cn("absolute top-1 left-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold", cat.tint)}>
            {cat.icon}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
                {report.id}
              </div>
              <h3 className="font-bold text-sm leading-tight mt-0.5 truncate">{report.title}</h3>
            </div>
            <StatusPill status={report.status} />
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span className="truncate">{report.location}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px]">
            {showPriority && (
              <span className={cn("rounded-md px-1.5 py-0.5 font-semibold", pri.chip)}>
                {pri.label} priority
              </span>
            )}
            <span className="text-muted-foreground">{timeAgo(report.createdAt)}</span>
            {showReporter && (
              <span className="text-muted-foreground">· {report.reporterName}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
