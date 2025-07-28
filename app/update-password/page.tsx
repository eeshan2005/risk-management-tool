import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        // User is authenticated via password recovery link
        // You might want to do something here, but the main logic is in handlePasswordUpdate
      } else if (event === 'SIGNED_IN' && session) {
        // If already signed in, redirect to dashboard or home
        router.push('/dashboard'); // Or wherever you want to redirect authenticated users
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
      } else {
        setMessage("Your password has been updated successfully. Redirecting to login...");
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      }
    } catch (err) {
      console.error("Error updating password:", err);
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
          onSubmit={handlePasswordUpdate}
          className="bg-white rounded-2xl shadow-2xl p-10 w-full space-y-8 border border-blue-900/10"
        >
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg mb-3">
              🛡️
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#0a174e] mb-1">AssureGate</h1>
            <div className="text-blue-700 text-base font-medium">Set New Password</div>
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
              <label className="block mb-2 font-medium text-[#0a174e]">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 text-[#0a174e] placeholder:text-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pr-12 transition-all duration-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12l2-2m0 0l4-4m-4 4l-4-4m4 4l4 4m6-4v6m-6-6h12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-[#0a174e]">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 rounded-lg border border-blue-200 text-[#0a174e] placeholder:text-blue-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pr-12 transition-all duration-200"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12l2-2m0 0l4-4m-4 4l-4-4m4 4l4 4m6-4v6m-6-6h12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-xl ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-bold text-lg shadow-lg transition-all duration-200 focus:ring-2 focus:ring-blue-400`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> 
                  Updating Password...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 text-blue-200 text-sm">
          © {new Date().getFullYear()} AssureGate Risk Management Tool
        </div>
      </div>
    </div>
  );
}