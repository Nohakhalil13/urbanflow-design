export type Role = "citizen" | "technician" | "admin";

export type ReportStatus = "pending" | "in_progress" | "done";
export type Priority = "high" | "medium" | "low";

export type Category =
  | "pothole"
  | "lighting"
  | "garbage"
  | "water"
  | "graffiti"
  | "tree"
  | "signage"
  | "other";

export interface Report {
  id: string;
  title: string;
  category: Category;
  description: string;
  location: string;
  coords: { lat: number; lng: number };
  status: ReportStatus;
  priority: Priority;
  beforeImage: string;
  afterImage?: string;
  reporterId: string;
  reporterName: string;
  technicianId?: string;
  technicianName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarColor: string;
}

export const DEMO_USERS: User[] = [
  {
    id: "u-citizen",
    name: "Amelia Chen",
    email: "citizen@urbanfix.app",
    phone: "+1 (555) 010-2031",
    role: "citizen",
    avatarColor: "from-primary to-primary-glow",
  },
  {
    id: "u-tech",
    name: "Marcus Reyes",
    email: "tech@urbanfix.app",
    phone: "+1 (555) 010-4422",
    role: "technician",
    avatarColor: "from-accent to-orange-400",
  },
  {
    id: "u-admin",
    name: "Priya Anand",
    email: "admin@urbanfix.app",
    phone: "+1 (555) 010-9001",
    role: "admin",
    avatarColor: "from-emerald-600 to-teal-500",
  },
];

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; tint: string }
> = {
  pothole: { label: "Pothole", icon: "🕳️", tint: "bg-amber-100 text-amber-700" },
  lighting: { label: "Street Light", icon: "💡", tint: "bg-yellow-100 text-yellow-700" },
  garbage: { label: "Garbage", icon: "🗑️", tint: "bg-emerald-100 text-emerald-700" },
  water: { label: "Water Leak", icon: "💧", tint: "bg-sky-100 text-sky-700" },
  graffiti: { label: "Graffiti", icon: "🎨", tint: "bg-fuchsia-100 text-fuchsia-700" },
  tree: { label: "Fallen Tree", icon: "🌳", tint: "bg-green-100 text-green-700" },
  signage: { label: "Signage", icon: "🪧", tint: "bg-orange-100 text-orange-700" },
  other: { label: "Other", icon: "🛠️", tint: "bg-slate-100 text-slate-700" },
};

export const TECHNICIANS = [
  { id: "u-tech", name: "Marcus Reyes" },
  { id: "u-tech-2", name: "Lina Okafor" },
  { id: "u-tech-3", name: "Diego Martins" },
];

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString();

export const SAMPLE_REPORTS: Report[] = [
  {
    id: "RPT-2041",
    title: "Deep pothole near Maple & 4th",
    category: "pothole",
    description:
      "Large pothole on the right lane heading north. Already caused a flat tire on my bike. Needs urgent repair before the weekend.",
    location: "Maple Ave & 4th St, Riverside",
    coords: { lat: 40.7128, lng: -74.006 },
    status: "in_progress",
    priority: "high",
    beforeImage:
      "https://images.unsplash.com/photo-1597176116047-876a32798fcc?w=900&q=70&auto=format&fit=crop",
    reporterId: "u-citizen",
    reporterName: "Amelia Chen",
    technicianId: "u-tech",
    technicianName: "Marcus Reyes",
    createdAt: hoursAgo(28),
    updatedAt: hoursAgo(3),
  },
  {
    id: "RPT-2039",
    title: "Streetlight out on Oak Lane",
    category: "lighting",
    description:
      "Three consecutive streetlights have been off for 5 nights. The block is very dark and feels unsafe.",
    location: "Oak Lane, between 12th and 14th",
    coords: { lat: 40.715, lng: -74.001 },
    status: "pending",
    priority: "medium",
    beforeImage:
      "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=900&q=70&auto=format&fit=crop",
    reporterId: "u-citizen",
    reporterName: "Amelia Chen",
    createdAt: hoursAgo(12),
    updatedAt: hoursAgo(12),
  },
  {
    id: "RPT-2037",
    title: "Overflowing bins at Civic Park",
    category: "garbage",
    description:
      "Trash overflowing for several days near the playground entrance. Attracting pests.",
    location: "Civic Park, west entrance",
    coords: { lat: 40.71, lng: -74.012 },
    status: "done",
    priority: "low",
    beforeImage:
      "https://images.unsplash.com/photo-1604187350690-e35b3d33f0bf?w=900&q=70&auto=format&fit=crop",
    afterImage:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=900&q=70&auto=format&fit=crop",
    reporterId: "u-citizen",
    reporterName: "Amelia Chen",
    technicianId: "u-tech",
    technicianName: "Marcus Reyes",
    createdAt: hoursAgo(72),
    updatedAt: hoursAgo(24),
  },
  {
    id: "RPT-2035",
    title: "Water leak flooding sidewalk",
    category: "water",
    description: "Continuous flow from a broken pipe under the curb.",
    location: "Birch St 220",
    coords: { lat: 40.717, lng: -74.008 },
    status: "pending",
    priority: "high",
    beforeImage:
      "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=900&q=70&auto=format&fit=crop",
    reporterId: "u-citizen",
    reporterName: "Amelia Chen",
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(6),
  },
  {
    id: "RPT-2030",
    title: "Graffiti on community center wall",
    category: "graffiti",
    description: "Large tag covering the front mural. Needs cleaning.",
    location: "Community Center, Pine Rd",
    coords: { lat: 40.711, lng: -74.003 },
    status: "in_progress",
    priority: "low",
    beforeImage:
      "https://images.unsplash.com/photo-1558981852-426c6c22a060?w=900&q=70&auto=format&fit=crop",
    reporterId: "u-citizen",
    reporterName: "Amelia Chen",
    technicianId: "u-tech-2",
    technicianName: "Lina Okafor",
    createdAt: hoursAgo(48),
    updatedAt: hoursAgo(8),
  },
  {
    id: "RPT-2028",
    title: "Fallen tree blocking bike path",
    category: "tree",
    description: "Storm last night brought down a medium tree across the path.",
    location: "Riverside Greenway, mile 2",
    coords: { lat: 40.72, lng: -74.014 },
    status: "done",
    priority: "medium",
    beforeImage:
      "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=900&q=70&auto=format&fit=crop",
    afterImage:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=70&auto=format&fit=crop",
    reporterId: "u-citizen",
    reporterName: "Amelia Chen",
    technicianId: "u-tech-3",
    technicianName: "Diego Martins",
    createdAt: hoursAgo(96),
    updatedAt: hoursAgo(40),
  },
];

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export const STATUS_META: Record<
  ReportStatus,
  { label: string; dot: string; chip: string; ring: string }
> = {
  pending: {
    label: "Pending",
    dot: "bg-status-pending",
    chip: "bg-status-pending-soft text-status-pending",
    ring: "ring-status-pending/30",
  },
  in_progress: {
    label: "In Progress",
    dot: "bg-status-progress",
    chip: "bg-status-progress-soft text-status-progress",
    ring: "ring-status-progress/30",
  },
  done: {
    label: "Resolved",
    dot: "bg-status-done",
    chip: "bg-status-done-soft text-status-done",
    ring: "ring-status-done/30",
  },
};

export const PRIORITY_META: Record<Priority, { label: string; chip: string }> = {
  high: { label: "High", chip: "bg-accent-soft text-accent" },
  medium: { label: "Medium", chip: "bg-amber-100 text-amber-700" },
  low: { label: "Low", chip: "bg-primary-soft text-primary" },
};
