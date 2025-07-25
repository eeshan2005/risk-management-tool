import Sidebar from "@/components/Sidebar";

export default function GuidelinesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen text-slate-900">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}