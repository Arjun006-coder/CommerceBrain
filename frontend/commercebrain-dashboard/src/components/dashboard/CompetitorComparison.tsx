import { Swords } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export function CompetitorComparison() {
  const { data, loading } = useDashboard();

  if (loading) return <div className="glass-card p-5 h-20 animate-pulse bg-muted/10"></div>;

  if (!data || !data.competitors || data.competitors.length === 0) {
    return (
      <div className="glass-card p-5 text-center text-muted-foreground">
        No competitor data available.
      </div>
    );
  }

  return (
    <div className="glass-card cyber-scan p-5 animate-fade-in-up stagger-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'hsl(var(--secondary) / 0.2)' }}>
          <Swords className="h-4 w-4 text-secondary" />
        </div>
        <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase">Competitor Comparison</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 text-left">
              <th className="pb-3 pr-4 font-display text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Brand</th>
              <th className="pb-3 pr-4 font-display text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Price</th>
              <th className="pb-3 pr-4 font-display text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Rating</th>
              <th className="pb-3 pr-4 font-display text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Key Feature</th>
              <th className="pb-3 font-display text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">Positioning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/20">
            {data.competitors.map((c: any, i: number) => (
              <tr key={i} className="transition-all duration-200 hover:bg-primary/5 group">
                <td className="py-3 pr-4 font-medium text-foreground group-hover:text-primary transition-colors">{c.brand}</td>
                <td className="py-3 pr-4 text-foreground/70 font-mono text-xs">{c.price}</td>
                <td className="py-3 pr-4"><span className="badge-success">{c.rating}</span></td>
                <td className="py-3 pr-4 text-muted-foreground">{c.feature || "Standard"}</td>
                <td className="py-3"><span className="badge-info">{c.position || "Competitor"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
