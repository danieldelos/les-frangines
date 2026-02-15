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
        <div className="min-h-screen">
          <Header />
          <main className="mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
          <footer className="mx-auto w-full max-w-5xl px-6 pb-10 text-sm text-slate-600">
            <div className="border-t border-border pt-6">
              <span className="font-medium">Les Frangines</span>{" "}
              <span className="text-slate-500">• Next.js 14 + Django</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

