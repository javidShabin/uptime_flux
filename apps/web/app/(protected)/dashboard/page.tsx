"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "../../../lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const user = getAuthUser();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Logged in as: {user.email}</p>
    </div>
  );
}
