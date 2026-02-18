import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Lightbulb, ArrowUpRight, DollarSign, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { useDashboard } from "@/context/DashboardContext";

interface Opportunity {
    id: string;
    title: string;
    description: string;
    potential_revenue: string;
    confidence: number;
}

export default function Opportunities() {
    const { data } = useDashboard();
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const category = data?.product_info?.category || "smartphones";
        setLoading(true);
        fetch(`http://localhost:8081/api/v1/opportunities/${category}`)
            .then(res => res.json())
            .then(data => {
                setOpportunities(data.opportunities || []);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, [data]);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="animate-fade-in-up">
                    <h1 className="shimmer-text text-2xl font-bold">Opportunity Finder</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        AI-detected market gaps and revenue opportunities
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-muted-foreground">Scanning market data...</div>
                ) : (
                    <div className="grid gap-6">
                        {opportunities.map((opp, idx) => (
                            <div
                                key={opp.id}
                                className="glass-card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between animate-fade-in-up"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded text-xs font-medium border border-yellow-500/20">
                                            High Confidence
                                        </span>
                                        <span className="text-xs text-muted-foreground">ID: {opp.id}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold">{opp.title}</h3>
                                    <p className="text-muted-foreground">{opp.description}</p>
                                </div>

                                <div className="flex flex-col gap-4 min-w-[200px]">
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                                        <div className="p-2 bg-green-500/10 rounded-full text-green-500">
                                            <DollarSign className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Est. Revenue</div>
                                            <div className="font-bold text-green-500">{opp.potential_revenue}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                                        <div className="p-2 bg-blue-500/10 rounded-full text-blue-500">
                                            <Target className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Confidence</div>
                                            <div className="font-bold text-blue-500">{opp.confidence}%</div>
                                        </div>
                                    </div>
                                </div>

                                <button className="p-3 rounded-full hover:bg-primary/10 transition-colors text-primary">
                                    <ArrowUpRight className="h-5 w-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
