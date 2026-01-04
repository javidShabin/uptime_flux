import Hero from "../components/landing/Hero";
import Problem from "../components/landing/Problem";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import { useAuth } from "../auth/useAuth";
import { Navigate } from "react-router-dom";
import Reliability from "../components/landing/Reliability";
import CTA from "../components/landing/CTA";
import Footer from "../components/landing/Footer";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <>
      <Hero />
      <Problem />
      <Features />
      <HowItWorks />
      <Reliability/>
      <CTA />
      <Footer />
    </>
  );
}
