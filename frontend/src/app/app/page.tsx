"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/lib/auth";

export default function AppHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (user.role === "admin") {
      router.replace("/dashboard/admin");
      return;
    }
    if (user.role === "professor") {
      router.replace("/dashboard/professor");
      return;
    }
    router.replace("/dashboard/aluno");
  }, [loading, user, router]);

  return <LoadingState />;
}
