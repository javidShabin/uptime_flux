import { ReactNode } from "react";
import Header from "../landing/Header";

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-gray-900">
      <Header />
      <main>{children}</main>
    </div>
  );
}

