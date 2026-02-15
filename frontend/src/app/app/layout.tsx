import { AppNav } from "@/components/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <AppNav />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

