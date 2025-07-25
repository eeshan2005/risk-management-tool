"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@/store/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuth((s) => s.setUser);
  const setProfile = useAuth((s) => s.setProfile);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (signInError || !data.user) {
      setError(signInError?.message || "Login failed");
      setLoading(false);
      return;
    }
    setUser(data.user);
    // Fetch profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, company_id, email")
      .eq("id", data.user.id)
      .single();
    if (profileError || !profile) {
      setError("Profile not found");
      setLoading(false);
      return;
    }
    setProfile(profile);
    setLoading(false);
    // Redirect by role
    if (profile.role === "admin") router.push("/admin");
    else if (profile.role === "assessor") router.push("/dashboard");
    else if (profile.role === "reviewer") router.push("/dashboard");
    else router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a174e] text-white">
      <form
        onSubmit={handleLogin}
        className="bg-white rounded-2xl shadow-2xl p-12 w-full max-w-xl space-y-10 border border-blue-900/10 relative z-10"
      >
        <div className="flex flex-col items-center mb-2">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-2">
            🛡️
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#0a174e] mb-1">AssureGate</h1>
          <div className="text-blue-700 text-base font-medium mb-2">Risk Management Login</div>
        </div>
        {error && <div className="text-red-500 font-semibold text-center bg-red-50/10 border border-red-400/20 rounded p-2">{error}</div>}
        <div>
          <label className="block mb-1 font-medium text-[#0a174e]">Email</label>
          <input
            type="email"
            className="form-input bg-white border-blue-200 text-[#0a174e] placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400 text-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-[#0a174e]">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-input bg-white border-blue-200 text-[#0a174e] placeholder:text-blue-400 focus:ring-2 focus:ring-blue-400 text-lg pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.13-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-2.13 2.13A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.13-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-2.13 2.13A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0m6 0a9.956 9.956 0 01-1.125 4.575m-2.13 2.13A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.13-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10z" /></svg>
              )}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2"><span className="animate-spin h-5 w-5 border-2 border-white border-t-blue-400 rounded-full"></span> Logging in...</span>
          ) : (
            "Login"
          )}
        </button>
        <div className="text-center text-sm mt-2 text-blue-700">
          Don&apos;t have an account? <a href="/signup" className="text-blue-600 hover:underline font-semibold">Sign up</a>
        </div>
      </form>
    </div>
  );
} 