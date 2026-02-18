import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MessageSquareText, Quote } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export default function CustomerVoice() {
    const { data, loading } = useDashboard();
    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in-up">
                <div>
                    <h1 className="shimmer-text text-2xl font-bold">Customer Voice</h1>
                    <p className="text-sm text-muted-foreground mt-1">What your customers are actually saying</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <div className="col-span-3 text-center py-10 text-muted-foreground animate-pulse">Loading reviews...</div>
                    ) : !data ? (
                        <div className="col-span-3 text-center py-10 text-muted-foreground">Search for a product to see customer voice.</div>
                    ) : (data.insights.recent_reviews || []).length > 0 ? (
                        (data.insights.recent_reviews || []).map((quote, i) => (
                            <div key={i} className="glass-card p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
                                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10 group-hover:text-primary/20 transition-colors" />
                                <p className="relative z-10 text-foreground/90 italic">"{quote.length > 150 ? quote.substring(0, 150) + "..." : quote}"</p>
                                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    Verified Review
                                </div>
                            </div>
                        ))) : (
                        <div className="col-span-3 text-center py-10 text-muted-foreground">No text reviews available for this product.</div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
