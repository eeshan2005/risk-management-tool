"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@/store/useAuth";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);
  const setProfile = useAuth((s) => s.setProfile);

  // ✅ Fetch companies from Supabase
  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name")
        .order("name");

      if (error) {
        console.error("Error fetching companies:", error.message);
      } else {
        setCompanies(data || []);
      }
    };

    fetchCompanies();
  }, []);

  // ✅ Listen for email confirmation + insert profile
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user && signedUp) {
          const user = session.user;

          const { data: existing, error: fetchErr } = await supabase
            .from("profiles")
            .select("id")
            .eq("id", user.id)
            .single();

          if (!existing && !fetchErr) {
            const { error: insertErr } = await supabase.from("profiles").insert({
              id: user.id,
              email: user.email,
              role: "reviewer",
              department_id: departmentId,
            });

            if (insertErr) {
              console.error("Insert profile error:", insertErr.message);
              setError(insertErr.message);
              return;
            }
          }

          setUser(user);
          setProfile({
            role: "reviewer",
            department_id: departmentId,
            email: user.email!,
          });

          router.push("/dashboard");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [signedUp, departmentId, router, setProfile, setUser]);

  // ✅ Sign-up form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message || "Signup failed");
      setLoading(false);
      return;
    }

    setSignedUp(true);
    setLoading(false);
  };

  // ✅ Render UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900">
      <form
        onSubmit={handleSignup}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Reviewer Signup</h1>

        {error && <div className="text-red-600 font-semibold">{error}</div>}

        {signedUp ? (
          <div className="text-green-700 font-semibold text-center">
            Please check your email to confirm your account.
          </div>
        ) : (
          <>
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
              <label className="block mb-1 font-medium">Select Department</label>
              <select
                className="form-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              >
                <option value="">Select a department</option>
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
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </div>
          </>
        )}
      </form>
    </div>
  );
}
