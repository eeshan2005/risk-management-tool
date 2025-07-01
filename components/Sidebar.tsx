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
    <aside className="w-64 bg-black text-white h-screen sticky top-0">
      <div className="text-2xl font-bold p-6">AssureGate</div>
      <nav className="flex flex-col space-y-1 px-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-700 ${
              pathname === href ? "bg-gray-800" : ""
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
