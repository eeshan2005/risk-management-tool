"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage("Password reset email sent. Please check your inbox.");
      }
    } catch (err) {
      console.error("Error during password reset process:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-blue-900 text-white">
      <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-5 pointer-events-none" />
      <div className="w-full max-w-md z-10">
        <form
          onSubmit={handleResetPassword}
          className="bg-white rounded-2xl shadow-2xl p-10 w-full space-y-8 border border-blue-900/10"
        >
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-3">
              🛡️
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0a174e] mb-1">AssureGate</h1>
            <div className="text-blue-700 text-base font-medium">Password Reset</div>
          </div>

          {message && (
            <div className="text-green-600 font-semibold text-center bg-green-50 border border-green-200 rounded-lg p-3 animate-fadeIn">
              {message}
            </div>
          )}
          {error && (
            <div className="text-red-500 font-semibold text-center bg-red-50 border border-red-200 rounded-lg p-3 animate-fadeIn">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-[#0a174e]">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-blue-200 text-[#0a174e] placeholder:text-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="Enter your email address"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold text-lg shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> 
                  Sending...
                </span>
              ) : (
                "Send Reset Email"
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <a href="/login" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm">
              Back to Login
            </a>
          </div>
        </form>

        <div className="text-center mt-6 text-blue-200 text-sm">
          © {new Date().getFullYear()} AssureGate Risk Management Tool
        </div>
      </div>
    </div>
  );
}