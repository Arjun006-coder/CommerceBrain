import { Lightbulb } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { useEffect, useState } from "react";

export function OpportunityFinder() {
  const { data, loading: dashboardLoading } = useDashboard();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.product_info?.category) {
      setLoading(true);
      fetch(`http://localhost:8081/api/v1/opportunities/${data.product_info.category}`)
        .then(res => res.json())
        .then(resData => {
          // Transform backend opportunities to widget format
          const ops = resData.opportunities.map((o: any) => ({
            text: o.title,
            tag: o.confidence > 80 ? "High Conf" : "Opportunity"
          }));
          setOpportunities(ops);
        })
        .finally(() => setLoading(false));
    }
  }, [data]);

  if (dashboardLoading || !data) return <div className="gradient-border-card p-5 h-24 animate-pulse bg-muted/10"></div>;

  return (
    <div className="gradient-border-card p-5 animate-fade-in-up stagger-3">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-lg anime-float"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Lightbulb className="h-4 w-4 text-primary-foreground" />
        </div>
        <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase">Opportunity Finder ({data.product_info.category})</h3>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-muted-foreground">Scanning market gaps...</div>
        ) : opportunities.length > 0 ? (
          opportunities.map((o, i) => (
            <div key={i} className="flex gap-3 group">
              <span className="mt-0.5 text-lg transition-transform duration-300 group-hover:scale-125">💡</span>
              <div className="flex-1">
                <p className="text-sm text-foreground/80 leading-relaxed">{o.text}</p>
                <span className="badge-success mt-2 inline-block">{o.tag}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">No open opportunities detected for this category.</div>
        )}
      </div>
    </div>
  );
}
