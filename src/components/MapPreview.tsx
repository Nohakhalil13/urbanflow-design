import { cn } from "@/lib/utils";

interface MapPreviewProps {
  location: string;
  className?: string;
  small?: boolean;
}

/**
 * Stylized static map preview (no external API). Uses SVG to draw an
 * abstract street grid with a coral pin — fits the design system.
 */
export function MapPreview({ location, className, small = false }: MapPreviewProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border/60 bg-primary-soft",
        small ? "h-28" : "h-44",
        className
      )}
    >
      <svg
        viewBox="0 0 400 220"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary-soft))" />
            <stop offset="100%" stopColor="hsl(174 40% 88%)" />
          </linearGradient>
          <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="hsl(var(--primary) / 0.08)" />
          </pattern>
        </defs>
        <rect width="400" height="220" fill="url(#mapBg)" />
        <rect width="400" height="220" fill="url(#dots)" />

        {/* "Parks" */}
        <path d="M20 150 q40 -30 90 -10 q40 16 30 60 H20 Z" fill="hsl(152 50% 78% / 0.55)" />
        <path d="M260 10 q60 20 80 70 q-30 20 -90 0 q-30 -20 10 -70 Z" fill="hsl(152 50% 78% / 0.45)" />

        {/* Roads */}
        <path d="M0 90 H400" stroke="white" strokeWidth="14" />
        <path d="M0 90 H400" stroke="hsl(var(--border))" strokeWidth="1" />
        <path d="M0 170 H400" stroke="white" strokeWidth="10" />
        <path d="M120 0 V220" stroke="white" strokeWidth="12" />
        <path d="M280 0 V220" stroke="white" strokeWidth="8" />
        <path d="M60 0 V220" stroke="white" strokeWidth="4" opacity="0.7" />

        {/* Pin */}
        <g transform="translate(200,110)">
          <circle r="22" fill="hsl(var(--accent) / 0.18)" className="animate-pulse-soft" />
          <circle r="12" fill="hsl(var(--accent) / 0.32)" />
          <circle r="6" fill="hsl(var(--accent))" />
          <circle r="2" fill="white" />
        </g>
      </svg>

      <div className="absolute left-3 bottom-3 rounded-full bg-card/95 backdrop-blur px-3 py-1.5 text-xs font-medium text-foreground shadow-sm flex items-center gap-1.5 max-w-[85%]">
        <svg className="h-3.5 w-3.5 text-accent flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
        </svg>
        <span className="truncate">{location}</span>
      </div>
    </div>
  );
}
