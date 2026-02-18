import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ShieldAlert, Zap } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { CompetitorComparison } from "@/components/dashboard/CompetitorComparison";

export default function CompetitorAnalysis() {
    const { data, loading } = useDashboard();
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in-up">
                <div>
                    <h1 className="shimmer-text text-2xl font-bold">Competitor Analysis</h1>
                    <p className="text-sm text-muted-foreground mt-1">Track market movers and shakers</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Head to Head */}
                    <div className="space-y-4">
                        <CompetitorComparison />
                        {data?.product_info && (
                            <div className="glass-card p-4 flex items-center justify-between">
                                <span className="font-medium">Your Sentiment Delta</span>
                                <span className={`text-sm font-bold ${(data.product_info.sentiment_score - 50) > 0 ? "text-green-500" : "text-red-500"}`}>
                                    {(data.product_info.sentiment_score - 50) > 0 ? "+" : ""}{(data.product_info.sentiment_score - 50).toFixed(1)}%
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Threats */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                            <ShieldAlert className="h-5 w-5 text-orange-500" />
                            Emerging Threats (Market News)
                        </h3>
                        <div className="space-y-3">
                            {["New Budget Launch by Brand X", "Price Drop on Flagship Y"].map((t, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm p-3 rounded-lg border border-orange-500/20 bg-orange-500/5">
                                    <Zap className="h-4 w-4 text-orange-500" />
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
