import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function DashboardCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className = "" 
}: DashboardCardProps) {
  return (
    <div className={`
      bg-white rounded-xl border border-slate-200 p-4 sm:p-6 
      hover:shadow-lg transition-all duration-200 group
      ${className}
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
          {icon}
        </div>
        {trend && (
          <div className={`
            flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full
            ${trend.isPositive 
              ? "text-green-700 bg-green-100" 
              : "text-red-700 bg-red-100"
            }
          `}>
            <span className={trend.isPositive ? "↗" : "↘"}>
              {trend.isPositive ? "↗" : "↘"}
            </span>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-slate-600 line-clamp-1">
          {title}
        </h3>
        <p className="text-2xl sm:text-3xl font-bold text-slate-900 line-clamp-1">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}