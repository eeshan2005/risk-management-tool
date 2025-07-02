import Sidebar from "@/components/Sidebar";

export default function QueryBuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 min-h-screen text-black">{children}</main>
    </div>
  );
}