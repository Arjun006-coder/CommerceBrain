import { Star, TrendingUp, TrendingDown, BarChart3, Shield } from "lucide-react";

import { useDashboard } from "@/context/DashboardContext";

export function ProductOverviewCard() {
  const { data, loading } = useDashboard();

  if (loading) return <div className="p-10 text-center animate-pulse">Analyzing Product Data...</div>;
  if (!data) return <div className="p-10 text-center text-muted-foreground">Search for a product to see insights</div>;

  const info = data.product_info;

  return (
    <div className="gradient-border-card cyber-scan animate-fade-in-up p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase">Product Overview</h3>
          <p className="mt-1 text-lg font-semibold text-foreground">{info.name}</p>
          <p className="text-xs text-muted-foreground">{info.category} • {info.rating} stars ({info.rating_count} reviews)</p>
        </div>
        <span className="badge-success">● Tracked</span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <MetricTile icon={<Star className="h-4 w-4" />} label="Avg Rating" value={info.rating.toString()} sub="/5.0" trend="up" />
        <MetricTile icon={<TrendingUp className="h-4 w-4" />} label="Price" value={`$${info.price}`} sub="current" trend="neutral" />
        <MetricTile icon={<BarChart3 className="h-4 w-4" />} label="Sentiment" value={`${info.sentiment_score}%`} sub="positive" trend={info.sentiment_score > 70 ? "up" : "down"} />
        <MetricTile icon={<Shield className="h-4 w-4" />} label="Confidence" value={`${info.confidence}%`} sub="AI score" trend="neutral" />
      </div>
    </div>
  );
}

function MetricTile({
  icon, label, value, sub, trend,
}: {
  icon: React.ReactNode; label: string; value: string; sub: string; trend: "up" | "down" | "neutral";
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg p-3 transition-all duration-300 hover:scale-[1.03]" style={{ background: 'hsl(var(--muted) / 0.4)' }}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{sub}</span>
      </div>
      {trend === "up" && <TrendingUp className="h-3 w-3 text-success" />}
      {trend === "down" && <TrendingDown className="h-3 w-3 text-destructive" />}
    </div>
  );
}
