import { CheckCircle2, TrendingUp } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

const priorityClass: Record<string, string> = {
  Critical: "badge-destructive",
  High: "badge-warning",
  Medium: "badge-info",
  Low: "badge-success",
};

export function AIRecommendations() {
  const { data, loading } = useDashboard();

  if (loading || !data) return <div className="glass-card p-5 h-full animate-pulse bg-muted/10"></div>;

  return (
    <div className="card-3d p-5 animate-fade-in-up stagger-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'hsl(var(--success) / 0.15)' }}>
          <TrendingUp className="h-4 w-4 text-success" />
        </div>
        <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase">AI Strategic Actions</h3>
      </div>

      <div className="space-y-2.5">
        {data.recommendations.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg p-3 transition-all duration-200 hover:translate-x-1 group border border-border/40 hover:border-primary/30"
            style={{ background: 'hsl(var(--muted) / 0.3)' }}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success transition-transform duration-200 group-hover:scale-110" />
            <span className="flex-1 text-sm text-foreground/80">{r.text}</span>
            <span className={priorityClass[r.priority] || "badge-info"}>{r.priority}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
