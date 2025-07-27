"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 min-h-screen text-slate-900 dark:text-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 border-b border-gray-200 pb-4">
            <div className="flex space-x-4">
              <Link 
                href="/admin"
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${pathname === '/admin' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Overview
              </Link>
              <Link 
                href="/admin/users"
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${pathname === '/admin/users' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                User Management
              </Link>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}