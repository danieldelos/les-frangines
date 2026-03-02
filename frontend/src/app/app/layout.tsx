"use client";

import { SakaiSidebar } from "@/components/SakaiSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SakaiSidebar />
      <main className="flex-1 transition-all duration-300 lg:ml-16">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}