import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PackageSearch, TrendingUp, BarChart2 } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function ProductInsights() {
    const { data, loading, candidates, selectProduct } = useDashboard();
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in-up">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="shimmer-text text-2xl font-bold">Product Insights</h1>
                        <p className="text-sm text-muted-foreground mt-1">Deep dive into individual product performance</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <div className="col-span-3 text-center py-10 text-muted-foreground animate-pulse">Loading insights...</div>
                    ) : candidates.length > 0 ? (
                        /* Show Search Candidates */
                        candidates.map((p, i) => (
                            <div key={i} className="glass-card p-6 flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold">{p.name}</h3>
                                        <span className="text-xs text-muted-foreground">{p.category}</span>
                                    </div>
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <PackageSearch className="h-4 w-4" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Price</span>
                                        <span className="font-medium">{p.price}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => selectProduct(p.product_id)}
                                    className="w-full mt-2 py-2 rounded-lg border border-border/50 hover:bg-primary/5 transition-colors text-sm font-medium"
                                >
                                    Analyze Details
                                </button>
                            </div>
                        ))
                    ) : data ? (
                        /* Show Current Product Details if selected */
                        <div className="glass-card p-6 flex flex-col gap-4 border-primary/50">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold">{data.product_info.name}</h3>
                                    <span className="text-xs text-muted-foreground">{data.product_info.category}</span>
                                </div>
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Sentiment Score</span>
                                    <span className="font-medium">{data.product_info.sentiment_score}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${data.product_info.sentiment_score}%` }} />
                                </div>
                            </div>

                            <div className="mt-2 text-sm text-muted-foreground">
                                Analysis completed. Check dashboard for full report.
                            </div>
                        </div>
                    ) : (
                        <div className="col-span-3 text-center py-10 text-muted-foreground">Search for a product to see insights.</div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
