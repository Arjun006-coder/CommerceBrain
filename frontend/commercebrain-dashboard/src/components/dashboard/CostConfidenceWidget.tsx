import { Database, Target, DollarSign, RefreshCw } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function CostConfidenceWidget() {
  const { data, loading } = useDashboard();

  if (loading || !data) return <div className="gradient-border-card p-5 h-full animate-pulse bg-muted/10"></div>;

  return (
    <div className="gradient-border-card p-5 animate-fade-in-up stagger-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase">Analysis Stats</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatBlock
          icon={<Target className="h-5 w-5" />}
          value={`${data.product_info.confidence}%`}
          label="Confidence"
          color="primary"
        />
        <StatBlock
          icon={<Database className="h-5 w-5" />}
          value={data.tokens.toLocaleString()}
          label="Tokens Used"
          color="info"
        />
        <StatBlock
          icon={<DollarSign className="h-5 w-5" />}
          value={`$${data.cost.toFixed(4)}`}
          label="Est. Cost"
          color="success"
        />
      </div>
    </div>
  );
}

function StatBlock({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  const colorMap: Record<string, string> = {
    primary: 'hsl(var(--primary) / 0.15)',
    info: 'hsl(var(--info) / 0.15)',
    success: 'hsl(var(--success) / 0.15)',
  };
  const textMap: Record<string, string> = {
    primary: 'text-primary',
    info: 'text-info',
    success: 'text-success',
  };

  return (
    <div
      className="flex flex-col items-center gap-2 rounded-lg p-4 transition-all duration-300 hover:scale-[1.05] anime-float"
      style={{ background: colorMap[color], animationDelay: `${Math.random() * 2}s` }}
    >
      <div className={textMap[color]}>{icon}</div>
      <span className="text-2xl font-bold text-foreground font-display">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}
