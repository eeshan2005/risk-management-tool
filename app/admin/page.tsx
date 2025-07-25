"use client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "", company_id: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!profile || profile.role !== "admin") {
      router.push("/login");
      return;
    }
    fetchUsers();
    supabase.from("companies").select("id, name").order("name").then(({ data }) => setCompanies(data || []));
  }, [profile]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("*, auth.users(email)");
    setUsers(data || []);
  };

  const handleAddAssessor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // 1. Create user in auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message || "Signup failed");
      setLoading(false);
      return;
    }
    // 2. Insert into profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: newUser.email,
      role: "assessor",
      company_id: newUser.company_id,
    });
    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }
    setShowAdd(false);
    setNewUser({ email: "", password: "", company_id: "" });
    fetchUsers();
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin User Management</h1>
      <button className="btn-primary mb-4" onClick={() => setShowAdd((v) => !v)}>
        {showAdd ? "Cancel" : "Add Assessor"}
      </button>
      {showAdd && (
        <form onSubmit={handleAddAssessor} className="space-y-4 mb-6">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="form-input"
              value={newUser.email}
              onChange={(e) => setNewUser((u) => ({ ...u, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="form-input"
              value={newUser.password}
              onChange={(e) => setNewUser((u) => ({ ...u, password: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Assign to Company</label>
            <select
              className="form-select"
              value={newUser.company_id}
              onChange={(e) => setNewUser((u) => ({ ...u, company_id: e.target.value }))}
              required
            >
              <option value="">Select a company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Assessor"}
          </button>
          {error && <div className="text-red-600 font-semibold">{error}</div>}
        </form>
      )}
      <h2 className="text-xl font-semibold mb-2">All Users</h2>
      <table className="w-full table-auto border mt-2">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Company</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border">{companies.find((c) => c.id === u.company_id)?.name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}