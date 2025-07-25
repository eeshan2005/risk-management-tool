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
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return <>{children}</>;
}