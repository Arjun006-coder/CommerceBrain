import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AnimatedBackground />
      <AppSidebar />
      <div className="flex flex-1 flex-col ml-[250px] transition-all duration-300 max-lg:ml-[68px]">
        <AppHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
