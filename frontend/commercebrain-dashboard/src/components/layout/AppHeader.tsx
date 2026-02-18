import { Search, Bell, ToggleLeft, ToggleRight, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/context/DashboardContext";

export function AppHeader() {
  const { searchQuery, runSearch, deepMode, setDeepMode, loading, candidates, selectProduct } = useDashboard();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(localQuery);
  };

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 px-6"
      style={{
        background: 'hsl(var(--card) / 0.5)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Search */}
      <form onSubmit={handleSearch} className="relative flex-1 max-w-xl group z-50">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder={loading ? "Analyzing..." : "Ask CommerceBrain (e.g., 'Samsung', 'iPhone')..."}
          className="h-10 w-full rounded-lg border border-border/50 bg-muted/30 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all"
        />
        {/* Candidates Dropdown */}
        {candidates.length > 0 && (
          <div className="absolute top-12 left-0 w-full rounded-lg border border-border/50 bg-card shadow-xl overflow-hidden animate-fade-in-up">
            <div className="p-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">Found {candidates.length} results:</div>
            {candidates.map((c) => (
              <button
                key={c.product_id}
                type="button"
                onClick={() => {
                  setLocalQuery(c.name);
                  selectProduct(c.product_id);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 hover:text-primary transition-colors flex items-center justify-between group"
              >
                <span className="truncate flex-1">{c.name}</span>
                <span className="text-xs text-muted-foreground group-hover:text-primary/70">{c.category}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Quick / Deep toggle */}
      <button
        onClick={() => setDeepMode(!deepMode)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
          deepMode
            ? "border-primary/50 bg-primary/10 text-primary shadow-glow-primary"
            : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
        )}
      >
        {deepMode ? (
          <Zap className="h-3.5 w-3.5" />
        ) : (
          <ToggleLeft className="h-4 w-4" />
        )}
        <span>{deepMode ? "Deep" : "Quick"}</span>
      </button>

      {/* Notifications */}
      <button className="relative rounded-lg p-2 text-muted-foreground transition-all hover:text-foreground hover:bg-muted/30">
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent animate-pulse" style={{ boxShadow: 'var(--glow-accent)' }} />
      </button>

      {/* Avatar */}
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-primary-foreground"
        style={{ background: 'var(--gradient-primary)' }}
      >
        PM
      </div>
    </header>
  );
}
