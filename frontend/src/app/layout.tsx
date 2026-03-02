import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Les Frangines",
  description: "Frontend (Next.js 14) integrado ao backend Django."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen w-full">
          <Header />
          <main className="w-full min-h-[calc(100vh-80px)]">
            {children}
          </main>
          <footer className="w-full bg-white border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-6 text-sm text-slate-600">
            <div className="mx-auto max-w-7xl">
              <span className="font-medium">Les Frangines</span>{" "}
              <span className="text-slate-500">• Next.js 14 + Django</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}