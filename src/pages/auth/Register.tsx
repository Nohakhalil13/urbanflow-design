import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please complete all fields");
      return;
    }
    sessionStorage.setItem("urbanfix.pendingPhone", form.phone);
    toast.success("Verification code sent!");
    navigate("/otp");
  };

  return (
    <div className="min-h-screen gradient-soft flex flex-col">
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 animate-fade-in">
            <Logo />
          </div>
          <div className="card-elevated p-8 animate-slide-up">
            <h1 className="text-3xl font-extrabold tracking-tight">Create account</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Join your neighbors keeping the city in shape.
            </p>

            <form onSubmit={handle} className="mt-6 space-y-4">
              <FormField icon={<User className="h-4 w-4" />} label="Full name">
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name" className="h-12 pl-11 bg-secondary/50 border-transparent" />
              </FormField>
              <FormField icon={<Mail className="h-4 w-4" />} label="Email">
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@city.com" className="h-12 pl-11 bg-secondary/50 border-transparent" />
              </FormField>
              <FormField icon={<Phone className="h-4 w-4" />} label="Phone">
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000" className="h-12 pl-11 bg-secondary/50 border-transparent" />
              </FormField>
              <FormField icon={<Lock className="h-4 w-4" />} label="Password">
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="At least 8 characters" className="h-12 pl-11 bg-secondary/50 border-transparent" />
              </FormField>

              <Button type="submit" variant="hero" size="lg" className="w-full mt-2">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-[11px] text-muted-foreground text-center">
                By continuing you agree to UrbanFix's Terms & Privacy.
              </p>
            </form>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/" className="font-bold text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function FormField({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-semibold mb-1.5">{label}</div>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</div>
        {children}
      </div>
    </label>
  );
}
