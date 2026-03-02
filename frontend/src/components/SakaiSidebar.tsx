"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { 
  FiHome, 
  FiUsers, 
  FiUser, 
  FiCalendar, 
  FiFolder, 
  FiDollarSign,
  FiChevronDown,
  FiChevronRight,
  FiMenu,
  FiX
} from "react-icons/fi";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  items?: MenuItem[];
  roles?: ("admin" | "professor" | "aluno")[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: <FiHome className="w-5 h-5" />,
    href: "/app",
    roles: ["admin", "professor", "aluno"]
  },
  {
    label: "Agenda",
    icon: <FiCalendar className="w-5 h-5" />,
    href: "/app/agenda",
    roles: ["admin", "professor", "aluno"]
  },
  {
    label: "Usuários",
    icon: <FiUsers className="w-5 h-5" />,
    href: "/dashboard/admin",
    roles: ["admin"]
  },
  {
    label: "Alunos",
    icon: <FiUsers className="w-5 h-5" />,
    href: "/dashboard/professor",
    roles: ["professor"]
  },
  {
    label: "Meu Perfil",
    icon: <FiUser className="w-5 h-5" />,
    href: "/dashboard/aluno",
    roles: ["aluno"]
  },
  {
    label: "Repositório",
    icon: <FiFolder className="w-5 h-5" />,
    href: "/app/repositorio",
    roles: ["admin", "professor", "aluno"]
  },
  {
    label: "Financeiro",
    icon: <FiDollarSign className="w-5 h-5" />,
    href: "/app/financeiro",
    roles: ["admin", "professor", "aluno"]
  }
];

interface SubMenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
  isExpanded?: boolean;
  hasSubItems?: boolean;
}

function SubMenuItem({ item, isCollapsed, isActive, onClick, isExpanded, hasSubItems }: SubMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
        ${isActive 
          ? "bg-blue-50 text-blue-700 shadow-sm" 
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        }
        ${isCollapsed ? "justify-center" : "justify-between"}
      `}
      aria-expanded={hasSubItems ? isExpanded : undefined}
    >
      <div className={`flex items-center ${isCollapsed ? "" : "gap-3"}`}>
        <div className={`
          ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}
          transition-colors duration-200
        `}>
          {item.icon}
        </div>
        {!isCollapsed && (
          <span className="truncate">{item.label}</span>
        )}
      </div>
      
      {!isCollapsed && hasSubItems && (
        <div className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
          <FiChevronRight className="w-4 h-4" />
        </div>
      )}
      
      {isCollapsed && !hasSubItems && (
        <div className="absolute left-full top-1/2 ml-2 -translate-y-1/2 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
          {item.label}
        </div>
      )}
    </button>
  );
}

export function SakaiSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const role = user?.role;
  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(role as any)
  );

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={() => setIsCollapsed(true)}
      />

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full bg-white shadow-lg border-r border-slate-200
        transition-all duration-300 ease-in-out z-50
        ${isCollapsed ? "w-16" : "w-64"}
        lg:translate-x-0
        ${isCollapsed ? "-translate-x-full" : "translate-x-0"}
      `}>
        {/* Header */}
        <div className={`
          flex items-center border-b border-slate-200 px-4 py-4
          ${isCollapsed ? "justify-center" : "justify-between"}
        `}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-belgium-black via-belgium-yellow to-belgium-red shadow-soft" />
              <div>
                <h1 className="text-lg font-bold text-slate-900">Les Frangines</h1>
                <p className="text-xs text-slate-500">Escola de francês</p>
              </div>
            </div>
          )}
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-200"
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            {isCollapsed ? <FiMenu className="w-5 h-5" /> : <FiX className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const hasSubItems = item.items && item.items.length > 0;
              const isItemExpanded = expandedItems.has(item.label);
              const isItemActive = isActive(item.href) || (hasSubItems && item.items?.some(subItem => isActive(subItem.href))) || false;

              return (
                <div key={item.label}>
                  <SubMenuItem
                    item={item}
                    isCollapsed={isCollapsed}
                    isActive={isItemActive}
                    isExpanded={isItemExpanded}
                    hasSubItems={hasSubItems}
                    onClick={() => {
                      if (hasSubItems) {
                        toggleExpanded(item.label);
                      }
                    }}
                  />
                  
                  {!isCollapsed && hasSubItems && isItemExpanded && (
                    <div className="mt-1 ml-8 space-y-1">
                      {item.items?.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href!}
                          className={`
                            flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200
                            ${isActive(subItem.href)
                              ? "bg-blue-50 text-blue-700 font-medium"
                              : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                            }
                          `}
                        >
                          <span className="truncate">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4">
          <div className={`
            flex items-center gap-3 rounded-lg p-3 text-sm
            ${isCollapsed ? "justify-center" : "justify-between"}
          `}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{user?.first_name || "Usuário"}</p>
                  <p className="text-xs text-slate-500 capitalize">{role}</p>
                </div>
              </div>
            )}
            
            <div className={`${isCollapsed ? "w-full flex justify-center" : ""}`}>
              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg bg-white p-2 shadow-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
        aria-label="Toggle menu"
      >
        <FiMenu className="w-5 h-5" />
      </button>
    </>
  );
}