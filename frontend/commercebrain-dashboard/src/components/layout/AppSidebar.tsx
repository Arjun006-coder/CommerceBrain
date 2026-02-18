import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  PackageSearch,
  MessageSquareText,
  Lightbulb,
  Swords,
  FileBarChart,
  Brain,
  Settings,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Product Insights", url: "/product-insights", icon: PackageSearch },
  { title: "Customer Voice", url: "/customer-voice", icon: MessageSquareText },
  { title: "Opportunities", url: "/opportunities", icon: Lightbulb },
  { title: "Competitor Analysis", url: "/competitor-analysis", icon: Swords },
  { title: "Reports", url: "/reports", icon: FileBarChart },
  { title: "Memory & Prefs", url: "/memory", icon: Brain },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[250px]"
      )}
      style={{
        background: 'hsl(228 30% 6% / 0.95)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg pulse-glow"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-display text-sm font-bold text-sidebar-accent-foreground tracking-wider animate-fade-in-up">
            CommerceBrain
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            end={item.url === "/"}
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeClassName="bg-sidebar-accent text-primary shadow-glow-primary"
          >
            <item.icon className="h-[18px] w-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex h-12 items-center justify-center border-t border-sidebar-border text-sidebar-foreground transition-all hover:text-primary"
      >
        <ChevronLeft
          className={cn("h-4 w-4 transition-transform duration-300", collapsed && "rotate-180")}
        />
      </button>
    </aside>
  );
}
