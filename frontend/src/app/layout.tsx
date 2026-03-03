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
          <footer className="w-full border-t border-slate-100 bg-white px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                  <div className="text-base font-bold text-brand-primary">Les Frangines</div>
                  <div className="mt-0.5 text-xs text-brand-support">aulas de francês</div>
                  <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-500">
                    Escola online de francês com videoaulas, aulas ao vivo e acompanhamento individual.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                  <a href="/login" className="hover:text-brand-primary transition-colors">Entrar</a>
                  <a href="/register" className="hover:text-brand-primary transition-colors">Criar conta</a>
                  <a href="/" className="hover:text-brand-primary transition-colors">Início</a>
                </div>
              </div>
              <div className="mt-8 border-t border-slate-100 pt-6 text-xs text-slate-400">
                © {new Date().getFullYear()} Les Frangines. Todos os direitos reservados.
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}