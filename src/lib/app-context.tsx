import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { DEMO_USERS, Report, ReportStatus, SAMPLE_REPORTS, User } from "./urbanfix-data";

interface AppState {
  user: User | null;
  reports: Report[];
  loginAs: (user: User) => void;
  logout: () => void;
  addReport: (r: Omit<Report, "id" | "createdAt" | "updatedAt" | "status" | "priority" | "reporterId" | "reporterName"> & { priority?: Report["priority"] }) => Report;
  updateStatus: (id: string, status: ReportStatus, afterImage?: string) => void;
  assignTechnician: (id: string, techId: string, techName: string) => void;
}

const Ctx = createContext<AppState | undefined>(undefined);

const STORAGE_KEY = "urbanfix.state.v1";

interface Persisted {
  userId: string | null;
  reports: Report[];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>(SAMPLE_REPORTS);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw) as Persisted;
        if (p.userId) {
          const u = DEMO_USERS.find((d) => d.id === p.userId);
          if (u) setUser(u);
        }
        if (p.reports?.length) setReports(p.reports);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const data: Persisted = { userId: user?.id ?? null, reports };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [user, reports]);

  const loginAs = useCallback((u: User) => setUser(u), []);
  const logout = useCallback(() => setUser(null), []);

  const addReport: AppState["addReport"] = useCallback((r) => {
    const id = `RPT-${Math.floor(2050 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();
    const newReport: Report = {
      ...r,
      id,
      status: "pending",
      priority: r.priority ?? "medium",
      reporterId: "u-citizen",
      reporterName: "Amelia Chen",
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    setReports((rs) => [newReport, ...rs]);
    return newReport;
  }, []);

  const updateStatus: AppState["updateStatus"] = useCallback((id, status, afterImage) => {
    setReports((rs) =>
      rs.map((r) =>
        r.id === id
          ? { ...r, status, afterImage: afterImage ?? r.afterImage, updatedAt: new Date().toISOString() }
          : r
      )
    );
  }, []);

  const assignTechnician: AppState["assignTechnician"] = useCallback((id, techId, techName) => {
    setReports((rs) =>
      rs.map((r) =>
        r.id === id
          ? {
              ...r,
              technicianId: techId,
              technicianName: techName,
              status: r.status === "pending" ? "in_progress" : r.status,
              updatedAt: new Date().toISOString(),
            }
          : r
      )
    );
  }, []);

  const value = useMemo<AppState>(
    () => ({ user, reports, loginAs, logout, addReport, updateStatus, assignTechnician }),
    [user, reports, loginAs, logout, addReport, updateStatus, assignTechnician]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
