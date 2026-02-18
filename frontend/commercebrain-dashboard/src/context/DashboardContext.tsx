
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { searchProducts, fetchQuickInsight, fetchDeepAnalysis } from "@/lib/api";

interface ProductData {
    product_info: {
        product_id: string;
        name: string;
        rating: number;
        rating_count: number;
        price: string;
        category: string;
        sentiment_score: number;
        confidence: number;
    };
    insights: {
        top_complaints: Array<{ theme: string; count: number; percentage: number }>;
        sentiment_distribution: { positive: number; negative: number };
        total_analyzed: number;
        recent_reviews?: string[];
    };
    recommendations: Array<{ text: string; priority: string }>;
    competitors: string[];
    cost: number;
    tokens: number;
}

interface DashboardContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    deepMode: boolean;
    setDeepMode: (mode: boolean) => void;
    data: ProductData | null;
    candidates: Array<{ product_id: string; name: string; category: string; price: string }>;
    loading: boolean;
    runSearch: (query: string) => void;
    selectProduct: (productId: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [deepMode, setDeepMode] = useState(false);
    const [data, setData] = useState<ProductData | null>(null);
    const [candidates, setCandidates] = useState<Array<any>>([]);
    const [loading, setLoading] = useState(false);

    // Initial load
    useEffect(() => {
        // Run initial analysis for a default product just to populate the dashboard
        runAnalysis("B09G9F5T3Z"); // Example valid ID if known, or let backend fallback
    }, []);


    const runSearch = async (query: string) => {
        if (!query) return;
        setLoading(true);
        setSearchQuery(query);
        setCandidates([]);

        try {
            // 1. First, search for products to populate candidates list
            const searchData = await searchProducts(query);

            if (Array.isArray(searchData) && searchData.length > 0) {
                setCandidates(searchData);
                // Automatically select the first one if it's a very strong match? 
                // Or just let user pick. For now let's persist the list for the UI to show.
                // But to keep dashboard active, maybe analyze the first one too?
                // runAnalysis(searchData[0].product_id); // Let user choose instead
            } else {
                toast({
                    title: "No products found",
                    description: "Try a different search term.",
                    variant: "destructive"
                });
                setLoading(false);
            }
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const runAnalysis = async (productId: string) => {
        setLoading(true);
        try {
            let result;
            if (deepMode) {
                result = await fetchDeepAnalysis(productId);
            } else {
                result = await fetchQuickInsight(productId, "comprehensive");
            }

            if (!result || result.error) throw new Error(result?.error || "Unknown error");

            setData(result);
            setCandidates([]); // Clear candidates after selection

            toast({
                title: "Analysis Complete",
                description: `Showing insights for ${result.product_info.name}`,
            });

        } catch (e) {
            console.error(e);
            toast({
                title: "Analysis Failed",
                description: "Could not fetch data for this product.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardContext.Provider value={{
            searchQuery, setSearchQuery, deepMode, setDeepMode, data, candidates, loading, runSearch, selectProduct: runAnalysis
        }}>
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboard() {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider");
    }
    return context;
}
