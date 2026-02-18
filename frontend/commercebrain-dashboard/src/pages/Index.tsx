import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProductOverviewCard } from "@/components/dashboard/ProductOverviewCard";
import { RiskAlertsPanel } from "@/components/dashboard/RiskAlertsPanel";
import { CustomerVoiceInsights } from "@/components/dashboard/CustomerVoiceInsights";
import { OpportunityFinder } from "@/components/dashboard/OpportunityFinder";
import { CompetitorComparison } from "@/components/dashboard/CompetitorComparison";
import { AIRecommendations } from "@/components/dashboard/AIRecommendations";
import { CostConfidenceWidget } from "@/components/dashboard/CostConfidenceWidget";
import { AIChatPanel } from "@/components/chat/AIChatPanel";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";

const Index = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="animate-fade-in-up">
          <h1 className="shimmer-text text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI-powered e-commerce intelligence at a glance
          </p>
        </div>

        <ProductOverviewCard />

        <div className="grid gap-6 lg:grid-cols-2">
          <RiskAlertsPanel />
          <CustomerVoiceInsights />
        </div>

        <OpportunityFinder />
        <CompetitorComparison />

        <div className="grid gap-6 lg:grid-cols-2">
          <AIRecommendations />
          <CostConfidenceWidget />
        </div>
      </div>

      {/* Floating Chat */}
      {chatOpen ? (
        <div
          className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border/50 animate-scale-in max-sm:inset-4 max-sm:h-auto max-sm:w-auto"
          style={{
            background: 'hsl(var(--card) / 0.8)',
            backdropFilter: 'blur(24px)',
            boxShadow: 'var(--glow-primary), var(--shadow-card)',
          }}
        >
          <button
            onClick={() => setChatOpen(false)}
            className="absolute right-3 top-3 z-10 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <AIChatPanel />
        </div>
      ) : (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-lg transition-all hover:scale-110 pulse-glow"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}
    </DashboardLayout>
  );
};

export default Index;
