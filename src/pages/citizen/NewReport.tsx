import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPreview } from "@/components/MapPreview";
import { useApp } from "@/lib/app-context";
import { Category, CATEGORY_META } from "@/lib/urbanfix-data";
import { cn } from "@/lib/utils";
import { Camera, Crosshair, Loader2, Send, Check } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_LOCATIONS = [
  "Maple Ave & 4th St, Riverside",
  "Oak Lane between 12th and 14th",
  "Civic Park, west entrance",
  "Birch St 220",
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1597176116047-876a32798fcc?w=900&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=900&q=70&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1548438294-1ad5d5f4f063?w=900&q=70&auto=format&fit=crop",
];

export default function NewReport() {
  const navigate = useNavigate();
  const { addReport } = useApp();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locating, setLocating] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  const detectLocation = () => {
    setLocating(true);
    setTimeout(() => {
      setLocation(SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)]);
      setLocating(false);
      toast.success("Location detected");
    }, 900);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setImage(url);
  };

  const submit = () => {
    if (!category || !title || !location) {
      toast.error("Please complete all fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newReport = addReport({
        title,
        category,
        description: description || "—",
        location,
        coords: { lat: 40.713 + Math.random() * 0.01, lng: -74.005 + Math.random() * 0.01 },
        beforeImage: image ?? FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)],
        priority: "medium",
      });
      toast.success("Report submitted!", { description: `Tracking ID ${newReport.id}` });
      navigate(`/report/${newReport.id}`);
    }, 700);
  };

  const canContinue = step === 1 ? !!category : step === 2 ? !!location : true;

  return (
    <AppShell back="/citizen" title="New report" subtitle={`Step ${step} of 3`}>
      {/* Progress */}
      <div className="flex gap-1.5 mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className={cn(
            "h-1.5 flex-1 rounded-full transition-base",
            s <= step ? "bg-primary" : "bg-secondary"
          )} />
        ))}
      </div>

      {step === 1 && (
        <section className="animate-fade-in">
          <h2 className="font-bold text-lg">What's the issue?</h2>
          <p className="text-sm text-muted-foreground mt-1">Pick the category that fits best.</p>
          <div className="grid grid-cols-3 gap-3 mt-5">
            {(Object.keys(CATEGORY_META) as Category[]).map((c) => {
              const m = CATEGORY_META[c];
              const active = category === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "card-elevated aspect-square flex flex-col items-center justify-center gap-2 transition-base hover:-translate-y-0.5",
                    active && "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary-soft"
                  )}
                >
                  <div className={cn("text-3xl transition-base", active && "scale-110")}>{m.icon}</div>
                  <div className="text-xs font-bold text-center px-1">{m.label}</div>
                  {active && (
                    <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="animate-fade-in space-y-5">
          <div>
            <h2 className="font-bold text-lg">Where is it?</h2>
            <p className="text-sm text-muted-foreground mt-1">We use your location to dispatch the closest team.</p>
          </div>

          <Button onClick={detectLocation} variant="soft" size="lg" className="w-full" disabled={locating}>
            {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4" />}
            {locating ? "Locating you…" : "Use my current location"}
          </Button>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">Address</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Maple Ave & 4th St"
              className="h-12 bg-secondary/50 border-transparent"
            />
          </div>

          {location && <MapPreview location={location} />}
        </section>
      )}

      {step === 3 && (
        <section className="animate-fade-in space-y-5">
          <div>
            <h2 className="font-bold text-lg">Add a photo & details</h2>
            <p className="text-sm text-muted-foreground mt-1">A clear photo helps us fix it faster.</p>
          </div>

          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          {image ? (
            <div className="relative">
              <img src={image} alt="Report" className="w-full h-56 object-cover rounded-2xl" />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-3 right-3 rounded-full bg-card/95 backdrop-blur px-3 py-1.5 text-xs font-semibold shadow-card"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full h-44 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary-soft transition-base"
            >
              <Camera className="h-7 w-7" />
              <div className="text-sm font-semibold">Take or upload a photo</div>
              <div className="text-xs">PNG or JPG, up to 10 MB</div>
            </button>
          )}

          <div>
            <label className="text-xs font-semibold mb-1.5 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={category ? `${CATEGORY_META[category].label} issue` : "Short summary"}
              className="h-12 bg-secondary/50 border-transparent"
            />
          </div>

          <div>
            <label className="text-xs font-semibold mb-1.5 block">Description (optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Anything else the team should know?"
              rows={3}
              className="bg-secondary/50 border-transparent resize-none"
            />
          </div>
        </section>
      )}

      {/* Footer actions */}
      <div className="fixed inset-x-0 bottom-24 z-20 px-5">
        <div className="max-w-3xl mx-auto flex gap-3">
          {step > 1 && (
            <Button variant="outline" size="lg" className="flex-1" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button variant="hero" size="lg" className="flex-1" disabled={!canContinue} onClick={() => setStep(step + 1)}>
              Continue
            </Button>
          ) : (
            <Button variant="accent" size="lg" className="flex-1" disabled={submitting || !title} onClick={submit}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Submit report
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
