import { cn } from "@/lib/utils";

export function Logo({ className, showWord = true }: { className?: string; showWord?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-9 w-9 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21h18" />
          <path d="M5 21V9l4-3 4 3v12" />
          <path d="M13 21v-7l4-3 4 3v7" />
          <circle cx="9" cy="13" r="0.6" fill="currentColor" />
        </svg>
        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-background" />
      </div>
      {showWord && (
        <div className="leading-none">
          <div className="font-extrabold text-lg tracking-tight text-foreground">
            Urban<span className="text-accent">Fix</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mt-0.5">
            Smart City Care
          </div>
        </div>
      )}
    </div>
  );
}
