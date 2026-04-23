import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useApp } from "@/lib/app-context";
import { DEMO_USERS } from "@/lib/urbanfix-data";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

export default function OtpVerify() {
  const navigate = useNavigate();
  const { loginAs } = useApp();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(45);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const phone = sessionStorage.getItem("urbanfix.pendingPhone") ?? "+1 (555) ••• ••00";

  useEffect(() => {
    refs.current[0]?.focus();
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const setDigit = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[i] = digit;
    setCode(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const verify = () => {
    if (code.join("").length < 6) {
      toast.error("Enter all 6 digits");
      return;
    }
    const u = DEMO_USERS.find((d) => d.role === "citizen")!;
    loginAs(u);
    toast.success("Phone verified!");
    navigate("/citizen");
  };

  return (
    <div className="min-h-screen gradient-soft flex flex-col">
      <div className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 animate-fade-in"><Logo /></div>

          <div className="card-elevated p-8 animate-slide-up text-center">
            <div className="mx-auto h-14 w-14 rounded-2xl gradient-accent flex items-center justify-center text-accent-foreground shadow-accent-glow">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-4">Verify your phone</h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              We sent a 6-digit code to <span className="font-semibold text-foreground">{phone}</span>
            </p>

            <div className="flex justify-center gap-2 mt-7">
              {code.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (refs.current[i] = el)}
                  inputMode="numeric"
                  value={d}
                  onChange={(e) => setDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  className="h-14 w-12 rounded-2xl border-2 border-border bg-secondary/40 text-center text-xl font-bold outline-none focus:border-primary focus:bg-card transition-base"
                />
              ))}
            </div>

            <Button onClick={verify} variant="hero" size="lg" className="w-full mt-7">
              Verify & continue
            </Button>

            <div className="mt-5 text-sm text-muted-foreground">
              {seconds > 0 ? (
                <>Resend code in <span className="font-semibold text-foreground">{seconds}s</span></>
              ) : (
                <button onClick={() => { setSeconds(45); toast.success("New code sent"); }} className="font-semibold text-primary hover:underline">
                  Resend code
                </button>
              )}
            </div>

            <div className="mt-5 rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary font-medium">
              Tip: any 6 digits will work in demo mode.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
