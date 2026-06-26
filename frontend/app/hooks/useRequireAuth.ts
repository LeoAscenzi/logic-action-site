"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

type Role = "admin" | "parent";

export function useRequireAuth(requiredRole?: Role) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? "en";

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace(`/${locale}/login`);
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(`/${locale}/dashboard/${user.role}`);
    }
  }, [user, isLoading, requiredRole, router, locale]);

  const isAuthorized = !isLoading && !!user && (!requiredRole || user.role === requiredRole);
  return { user, isLoading, isAuthorized };
}
