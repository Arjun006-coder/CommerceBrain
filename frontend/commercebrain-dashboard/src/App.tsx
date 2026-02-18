import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardProvider } from "@/context/DashboardContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import MemoryPreferences from "./pages/MemoryPreferences";
import Analytics from "./pages/Analytics";
import Opportunities from "./pages/Opportunities";
import ProductInsights from "./pages/ProductInsights";
import CustomerVoice from "./pages/CustomerVoice";
import CompetitorAnalysis from "./pages/CompetitorAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DashboardProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/memory" element={<MemoryPreferences />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Analytics />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/product-insights" element={<ProductInsights />} />
            <Route path="/customer-voice" element={<CustomerVoice />} />
            <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </DashboardProvider>
  </QueryClientProvider>
);

export default App;
