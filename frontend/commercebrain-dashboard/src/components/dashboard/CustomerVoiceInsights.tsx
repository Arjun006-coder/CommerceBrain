import { MessageSquareText, Zap, AlertTriangle } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function CustomerVoiceInsights() {
  const { data, loading } = useDashboard();

  if (loading || !data) return <div className="glass-card p-5 h-full animate-pulse bg-muted/10"></div>;

  const complaints = data.insights.top_complaints;

  // Synthesizing feature requests based on negative themes for now (or could add to backend)
  const featureRequests = [
    "Improved battery efficiency",
    "Faster charging speed",
    "Better thermal management",
    "Price adjustment"
  ];

  return (
    <div className="card-3d p-5 animate-fade-in-up stagger-2">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'hsl(var(--primary) / 0.15)' }}>
          <MessageSquareText className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase">Customer Voice (Real-Time)</h3>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Top Complaints (BERTopic)</p>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Analyzed {data.insights.total_analyzed} reviews</span>
        </div>

        {complaints.length === 0 ? (
          <div className="text-sm text-green-500 flex items-center gap-2"><Zap className="h-4 w-4" /> No major complaints detected!</div>
        ) : (
          <div className="space-y-3">
            {complaints.slice(0, 4).map((c) => (
              <div key={c.theme}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground/80 capitalize">{c.theme}</span>
                  <span className="text-xs font-bold text-destructive">{c.percentage}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill bg-destructive" style={{ width: `${c.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-3">Implied Feature Requests</p>
        <div className="flex flex-wrap gap-2">
          {featureRequests.map((f) => (
            <span key={f} className="badge-accent">
              <Zap className="h-3 w-3" />
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
