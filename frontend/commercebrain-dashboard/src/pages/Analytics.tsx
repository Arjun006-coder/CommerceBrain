

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BarChart3, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useDashboard } from "@/context/DashboardContext";

export default function Analytics() {
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const { toast } = useToast();

    const { data } = useDashboard();

    // ... rest of component

    const runDeepAnalysis = async () => {
        if (!data) return;
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8002/api/v1/deep-analysis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    // Send product name if ID is generic/missing to trigger semantic search fallback
                    product_id: data.product_info.product_id || data.product_info.name,
                    analysis_type: "comprehensive"
                })
            });
            const result = await res.json();
            setAnalysis(result);
            toast({
                title: "Analysis Complete",
                description: `Confidence Score: ${result.confidence}`,
            });
        } catch (e) {
            toast({
                title: "Error",
                description: "Failed to run analysis",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="animate-fade-in-up">
                    <h1 className="shimmer-text text-2xl font-bold">Deep Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Comprehensive market and competitor analysis
                    </p>
                </div>

                {!analysis ? (
                    <div className="glass-card p-10 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in-up">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <BarChart3 className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-medium">Ready to Analyze</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Run a deep dive analysis on your current product catalog to identify hidden trends and competitor moves.
                        </p>
                        <button
                            onClick={runDeepAnalysis}
                            disabled={loading}
                            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            {loading ? "Analyzing..." : "Start Deep Analysis"}
                            {!loading && <ArrowRight className="h-4 w-4" />}
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 animate-fade-in-up">
                        <div className="glass-card p-6 border-l-4 border-l-primary">
                            <h3 className="text-lg font-medium mb-2">Executive Summary</h3>
                            <p className="text-muted-foreground">{analysis.report.summary}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="glass-card p-6">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Key Factors</h3>
                                <ul className="space-y-2">
                                    {analysis.report.key_factors.map((f: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="glass-card p-6">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Competitors</h3>
                                <ul className="space-y-2">
                                    {analysis.report.competitors.map((c: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                                            <span>{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="glass-card p-6 bg-primary/5 border-primary/20">
                            <h3 className="text-lg font-medium text-primary mb-2 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Strategic Recommendation
                            </h3>
                            <p className="text-foreground/90">{analysis.report.recommendation}</p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
