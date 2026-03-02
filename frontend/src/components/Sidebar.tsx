"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiHome,
  FiTrendingDown,
  FiTrendingUp,
  FiUser,
  FiUsers
} from "react-icons/fi";

import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/lib/auth";

type NavItem = { href: string; label: string; icon: React.ReactNode };

const navByRole: Record<"admin" | "professor" | "aluno", NavItem[]> = {
  admin: [
    { href: "/dashboard/admin", label: "Visão geral", icon: <FiHome className="h-4 w-4" /> },
    { href: "/dashboard/admin/finance", label: "Financeiro", icon: <FiDollarSign className="h-4 w-4" /> },
    {
      href: "/dashboard/admin/finance/contas-pagar",
      label: "Contas a pagar",
      icon: <FiTrendingDown className="h-4 w-4" />
    },
    {
      href: "/dashboard/admin/finance/contas-receber",
      label: "Contas a receber",
      icon: <FiTrendingUp className="h-4 w-4" />
    },
    {
      href: "/dashboard/admin/finance/fluxo-caixa",
      label: "Fluxo de caixa",
      icon: <FiActivity className="h-4 w-4" />
    },
    { href: "/dashboard/admin", label: "Usuários", icon: <FiUsers className="h-4 w-4" /> }
  ],
  professor: [
    { href: "/dashboard/professor", label: "Alunos", icon: <FiUsers className="h-4 w-4" /> }
  ],
  aluno: [
    { href: "/dashboard/aluno", label: "Meu perfil", icon: <FiUser className="h-4 w-4" /> }
  ]
};

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const role = user?.role;
  const items = role ? navByRole[role] : [];

  const activeHref =
    items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))?.href ?? "";

  return (
    <aside
      className={`relative flex h-full min-h-[calc(100vh-80px)] flex-col self-stretch rounded-2xl border border-border bg-white/70 shadow-soft backdrop-blur motion-reduce:transition-none transition-all duration-300 ${
        collapsed ? "w-full p-3 lg:w-20" : "w-full p-4 lg:w-64"
      }`}
    >
      <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed ? (
          <div className="text-xs font-semibold tracking-wide text-slate-600">
            {role ? `Menu ${role}` : "Menu"}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="rounded-lg border border-border bg-white p-2 text-slate-600 hover:bg-slate-100 motion-reduce:transition-none transition-colors duration-200"
        >
          {collapsed ? <FiChevronRight className="h-4 w-4" /> : <FiChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <nav className={`mt-4 grid gap-1 ${collapsed ? "justify-items-center" : ""}`}>
        {items.map((item) => {
          const isActive = activeHref === item.href;
          return (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium motion-reduce:transition-none transition-all duration-200 ${
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              } ${collapsed ? "justify-center px-0" : ""}`}
            >
              <span className={`${isActive ? "text-slate-900" : "text-slate-500"} transition-colors duration-200`}>
                {item.icon}
              </span>
              {!collapsed ? <span className="truncate">{item.label}</span> : null}
              {collapsed ? (
                <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                  {item.label}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className={`mt-4 ${collapsed ? "flex justify-center" : ""}`}>
        <LogoutButton />
      </div>
    </aside>
  );
}
