"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/useAuth";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push("/login");
    }
  }, [user, profile, loading, router]);

  if (loading || !user || !profile) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return <>{children}</>;
} 