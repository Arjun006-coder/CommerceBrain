import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Brain, Save, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function MemoryPreferences() {
  const [optimizeFor, setOptimizeFor] = useState("growth");
  const [saved, setSaved] = useState(false);

  // Load prefs
  useEffect(() => {
    fetch("http://localhost:8081/api/v1/memory/preference/default_user")
      .then(res => res.json())
      .then(data => {
        if (data.optimize_for) setOptimizeFor(data.optimize_for);
      });
  }, []);

  const handleSave = async () => {
    await fetch("http://localhost:8081/api/v1/memory/preference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "default_user",
        optimize_for: optimizeFor,
        marketplaces: ["Amazon", "Flipkart"],
        categories: ["Smartphones"],
        report_style: "Visual / Charts"
      })
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="shimmer-text text-2xl font-bold">Memory & Preferences</h1>
          <p className="text-sm text-muted-foreground mt-1">AI remembers your preferences across sessions</p>
        </div>

        <div className="glass-card p-5 animate-fade-in-up stagger-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase">Optimization Goal</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["profit", "growth"].map((opt) => (
              <button
                key={opt}
                onClick={() => setOptimizeFor(opt)}
                className={`rounded-lg border p-4 text-sm font-medium capitalize transition-all duration-300 ${optimizeFor === opt
                  ? "border-primary/50 text-primary"
                  : "border-border/30 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                style={optimizeFor === opt ? { background: 'hsl(var(--primary) / 0.1)', boxShadow: 'var(--shadow-glow)' } : { background: 'hsl(var(--muted) / 0.3)' }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 animate-fade-in-up stagger-2">
          <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase mb-3">Marketplaces</h3>
          <div className="flex flex-wrap gap-2">
            {["Amazon", "Flipkart", "Walmart", "eBay", "Best Buy"].map((m) => (
              <label key={m} className="flex items-center gap-2 rounded-lg border border-border/30 px-3 py-2 text-sm cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                <input type="checkbox" defaultChecked={m === "Amazon" || m === "Flipkart"} className="rounded accent-primary" />
                <span className="text-foreground/80">{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 animate-fade-in-up stagger-3">
          <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {["Smartphones", "Laptops", "Wearables", "Audio", "Tablets"].map((c) => (
              <label key={c} className="flex items-center gap-2 rounded-lg border border-border/30 px-3 py-2 text-sm cursor-pointer transition-all hover:border-primary/30 hover:bg-primary/5" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
                <input type="checkbox" defaultChecked={c === "Smartphones"} className="rounded accent-primary" />
                <span className="text-foreground/80">{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="glass-card p-5 animate-fade-in-up stagger-4">
          <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase mb-3">Report Style</h3>
          <select className="w-full rounded-lg border border-border/30 px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" style={{ background: 'hsl(var(--muted) / 0.3)' }}>
            <option>Executive Summary</option>
            <option>Detailed Analysis</option>
            <option>Data-Heavy</option>
            <option>Visual / Charts</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:scale-105"
          style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-glow)' }}
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? "Saved!" : "Save Preferences"}
        </button>
      </div>
    </DashboardLayout>
  );
}
