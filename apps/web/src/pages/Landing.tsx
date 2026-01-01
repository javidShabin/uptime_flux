import Header from "../components/landing/Header";
import Hero from "../components/landing/Hero";
import Problem from "../components/landing/Problem";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import CTA from "../components/landing/CTA";
import { useAuth } from "../auth/useAuth";
import { Navigate } from "react-router-dom";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-black text-gray-900">
      <Header />

      <main className="">
        <Hero />
      </main>
    </div>
  );
}
