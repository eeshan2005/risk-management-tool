"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@/store/useAuth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);
  const setProfile = useAuth((s) => s.setProfile);

  useEffect(() => {
    supabase
      .from("companies")
      .select("id, name")
      .order("name")
      .then(({ data }) => setCompanies(data || []));
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // 1. Create user in auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message || "Signup failed");
      setLoading(false);
      return;
    }
    setUser(data.user);
    // 2. Insert into profiles
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      role: "reviewer",
      company_id: companyId,
    });
    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }
    setProfile({ role: "reviewer", company_id: companyId, email });
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
      <form
        onSubmit={handleSignup}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Reviewer Signup</h1>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Select Company</label>
          <select
            className="form-select"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
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
        <button
          type="submit"
          className="btn-primary w-full mt-4"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <div className="text-center text-sm mt-2">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </form>
    </div>
  );
} 