"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shield, Search, Book } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Risk Assessment", href: "/risk-assessment", icon: Shield },
  { label: "Query Builder", href: "/query-builder", icon: Search },
  { label: "Guidelines", href: "/guidelines", icon: Book },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen sticky top-0 border-r border-slate-700 slide-in">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <div className="text-xl font-bold">AssureGate</div>
            <div className="text-xs text-slate-400">Risk Management</div>
          </div>
        </div>
      </div>
      
      <nav className="flex flex-col space-y-2 p-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
              pathname === href 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
            }`}
          >
            <Icon size={20} className={`${pathname === href ? "text-white" : "text-slate-400 group-hover:text-blue-400"} transition-colors`} />
            <span className="font-medium">{label}</span>
            {pathname === href && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400 text-center">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
}
