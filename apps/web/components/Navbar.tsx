"use client";

import { useRouter } from "next/navigation";

type User = {
  email: string;
  role?: string;
};

export default function Navbar({ user }: { user: User | null }) {
  const router = useRouter();

  async function handleLogout() {
    // TEMP: frontend-only logout
    // Later: POST /api/auth/logout
    router.push("/login");
    router.refresh();
  }

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <strong style={{ cursor: "pointer" }} onClick={() => router.push("/")}>
        UptimeFlux
      </strong>

      {user ? (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span>{user.email}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => router.push("/login")}>Login</button>
      )}
    </nav>
  );
}
