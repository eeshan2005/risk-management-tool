import Sidebar from "@/components/Sidebar";

export default function RiskAssessmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto text-slate-900">
          {children}
        </div>
      </main>
    </div>
  );
}