
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Shield, Search, Book, Building2, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@/store/useAuth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Risk Assessment", href: "/risk-assessment", icon: Shield },
  { label: "Query Builder", href: "/query-builder", icon: Search },
  { label: "Guidelines", href: "/guidelines", icon: Book },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [isCompaniesOpen, setIsCompaniesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
  const { profile } = useAuth();

  // Update current company ID whenever URL changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const companyId = params.get('company');
      setCurrentCompanyId(companyId);
      
      // If we're on the risk assessment page and have a company ID, ensure it's selected
      if (pathname === '/risk-assessment' && companyId && companies.some(c => c.id === companyId)) {
        setIsCompaniesOpen(true); // Expand the companies section
      }
    }
  }, [pathname, typeof window !== 'undefined' ? window.location.search : '', companies]);
  
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');

        if (error) throw error;
        setCompanies(data || []);
      } catch (err: any) {
        console.error('Error fetching companies:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [pathname]); // Re-fetch when pathname changes to ensure sidebar updates

  const handleCreateCompany = async () => {
    if (!newCompanyName.trim()) {
      setCreateError('Please enter a company name');
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      const { data, error } = await supabase
        .from('companies')
        .insert([{ name: newCompanyName.trim() }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        // Refresh companies list
        const { data: updatedCompanies, error: fetchError } = await supabase
          .from('companies')
          .select('id, name')
          .order('name');

        if (fetchError) throw fetchError;
        setCompanies(updatedCompanies || []);

        // Navigate to risk assessment page with the new company selected
        router.push(`/risk-assessment?company=${data[0].id}`);
        
        // Close modal and reset form
        setShowCreateModal(false);
        setNewCompanyName("");
      }
    } catch (err: any) {
      setCreateError(`Error creating company: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCompanySelect = (companyId: string) => {
    // Update local state immediately
    setCurrentCompanyId(companyId);
    
    // Use router.replace instead of router.push for immediate navigation
    // The replace method updates the URL without adding to history
    // This forces a re-render of the page component
    router.replace(`/risk-assessment?company=${companyId}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  // Only show assigned company for reviewer/assessor
  const filteredCompanies = profile?.role === 'admin'
    ? companies
    : companies.filter(c => c.id === profile?.company_id);

  return (
    <>
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

          {/* Admin-only: Add Assessor */}
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                pathname === "/admin"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
              }`}
            >
              <Plus size={20} className={`${pathname === "/admin" ? "text-white" : "text-slate-400 group-hover:text-blue-400"} transition-colors`} />
              <span className="font-medium">Add Assessor</span>
              {pathname === "/admin" && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          )}

          {/* Companies Section */}
          <div className="mt-6">
            <button 
              onClick={() => setIsCompaniesOpen(!isCompaniesOpen)}
              className="flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 w-full text-slate-300 hover:bg-slate-700/50 hover:text-white"
            >
              <Building2 size={20} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="font-medium">Companies</span>
              {isCompaniesOpen ? (
                <ChevronDown size={16} className="ml-auto" />
              ) : (
                <ChevronRight size={16} className="ml-auto" />
              )}
            </button>

            {isCompaniesOpen && (
              <div className="ml-6 mt-2 space-y-1">
                {/* Create New Company Button */}
                {profile?.role === 'admin' && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 w-full text-green-400 hover:bg-slate-700/30 hover:text-green-300"
                  >
                    <Plus size={16} />
                    <span>Create New Company</span>
                  </button>
                )}

                {isLoading ? (
                  <div className="text-slate-400 text-sm px-4 py-2">Loading...</div>
                ) : error ? (
                  <div className="text-red-400 text-sm px-4 py-2">Error loading companies</div>
                ) : filteredCompanies.length === 0 ? (
                  <div className="text-slate-400 text-sm px-4 py-2">No companies found</div>
                ) : (
                  filteredCompanies.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleCompanySelect(company.id)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 w-full text-left ${
                        currentCompanyId === company.id
                          ? "bg-blue-600/20 text-blue-300" 
                          : "text-slate-400 hover:bg-slate-700/30 hover:text-slate-200"
                      }`}
                    >
                      {company.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Profile and Logout at the bottom */}
        <div className="mt-auto p-4 border-t border-slate-700">
          {profile && (
            <div className="mb-4 flex flex-col items-center text-xs text-slate-300 bg-slate-800/80 rounded-xl p-4 shadow-inner">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold text-white shadow-md">
                  {profile.email?.[0]?.toUpperCase()}
                </div>
                <div className="flex flex-col items-start">
                  <div className="font-semibold text-white text-sm">{profile.email}</div>
                  <div className="bg-blue-700 text-white px-2 py-0.5 rounded-full text-xs capitalize mt-1 shadow">{profile.role}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 px-5 py-1.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg text-xs font-semibold transition-all shadow hover:scale-105 focus:ring-2 focus:ring-red-400"
              >
                Logout
              </button>
            </div>
          )}
          <div className="text-xs text-slate-400 text-center">
            Version 1.0.0
          </div>
        </div>
      </aside>

      {/* Create New Company Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 fade-in">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-slate-900">Create New Company</h2>
              <p className="text-slate-600 mt-1">
                Add a new company to manage risks
              </p>
            </div>

            <div className="p-6">
              {createError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {createError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    placeholder="Enter company name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCreateCompany();
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewCompanyName("");
                  setCreateError(null);
                }}
                disabled={isCreating}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCompany}
                disabled={isCreating || !newCompanyName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? 'Creating...' : 'Create Company'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
