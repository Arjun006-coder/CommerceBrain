import { AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchQuickInsight } from "@/lib/api";

type Alert = {
  text: string;
  severity: "high" | "medium" | "low";
};

const severityClass = {
  high: "badge-destructive",
  medium: "badge-warning",
  low: "badge-info",
};

import { useDashboard } from "@/context/DashboardContext";

export function RiskAlertsPanel() {
  const { data, loading } = useDashboard();

  if (loading || !data) return <div className="card-3d p-5 h-full animate-pulse bg-muted/10"></div>;

  const alerts = data.insights.top_complaints.map((c) => ({
    text: `Frequent complaint: ${c.theme} (${c.percentage}%)`,
    severity: c.percentage > 30 ? "high" : "medium"
  })) as Alert[];

  return (
    <div className="card-3d p-5 animate-fade-in-up stagger-1">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'hsl(var(--warning) / 0.15)' }}>
          <AlertTriangle className="h-4 w-4 text-warning" />
        </div>
        <h3 className="font-display text-xs font-medium tracking-wider text-muted-foreground uppercase">Risk Alerts</h3>
        <span className="ml-auto badge-destructive">{alerts.length} active</span>
      </div>

      <div className="space-y-2.5">
        {alerts.length > 0 ? (
          alerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg p-3 transition-all duration-200 hover:translate-x-1"
              style={{ background: 'hsl(var(--muted) / 0.3)' }}
            >
              <span className="mt-0.5 text-warning text-sm">⚠</span>
              <p className="flex-1 text-sm text-foreground/80">{alert.text}</p>
              <span className={severityClass[alert.severity]}>{alert.severity}</span>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">No significant risks detected.</div>
        )}
      </div>
    </div>
  );
}
