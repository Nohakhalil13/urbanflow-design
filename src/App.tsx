import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/lib/app-context";
import { RequireRole } from "@/components/RequireRole";

import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Register from "./pages/auth/Register";
import OtpVerify from "./pages/auth/OtpVerify";

import CitizenHome from "./pages/citizen/Home";
import MyReports from "./pages/citizen/MyReports";
import NewReport from "./pages/citizen/NewReport";

import TechTasks from "./pages/tech/Tasks";
import TaskDetails from "./pages/tech/TaskDetails";

import AdminDashboard from "./pages/admin/Dashboard";

import ReportDetails from "./pages/ReportDetails";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" richColors />
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp" element={<OtpVerify />} />

            {/* Citizen */}
            <Route path="/citizen" element={<RequireRole role="citizen"><CitizenHome /></RequireRole>} />
            <Route path="/citizen/reports" element={<RequireRole role="citizen"><MyReports /></RequireRole>} />
            <Route path="/citizen/new" element={<RequireRole role="citizen"><NewReport /></RequireRole>} />
            <Route path="/citizen/profile" element={<RequireRole role="citizen"><Profile /></RequireRole>} />

            {/* Technician */}
            <Route path="/tech" element={<RequireRole role="technician"><TechTasks /></RequireRole>} />
            <Route path="/tech/task/:id" element={<RequireRole role="technician"><TaskDetails /></RequireRole>} />
            <Route path="/tech/profile" element={<RequireRole role="technician"><Profile /></RequireRole>} />

            {/* Admin */}
            <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
            <Route path="/admin/profile" element={<RequireRole role="admin"><Profile /></RequireRole>} />

            {/* Shared */}
            <Route path="/report/:id" element={<RequireRole role={["citizen", "technician", "admin"]}><ReportDetails /></RequireRole>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
