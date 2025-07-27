"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, initializeAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No authenticated user, redirect to login
        router.push("/login");
      } else if (!profile) {
        // User is authenticated but no profile found
        console.warn("User authenticated but no profile found in protected layout");
        // You can decide to either redirect to a specific page or allow access
        // For now, we'll allow access but log the warning
      }
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }
  
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Redirecting to login...</div>;
  }

  return <>{children}</>;
}