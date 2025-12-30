import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (!token) {
    redirect("/login");
  }

  // For now, pass null to Navbar since we don't have user email from token
  // The middleware already protects the route, so we know user is authenticated
  return (
    <>
      <Navbar user={null} />
      <main style={{ padding: 20 }}>{children}</main>
    </>
  );
}
