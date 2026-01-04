import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <span className="text-white/80 font-medium">
          Uptime<span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">Flux</span>
        </span>

        {/* Links */}
        <div className="flex gap-6 text-sm text-white/60">
          <Link to="/login" className="hover:text-white transition-colors duration-200">
            Login
          </Link>
          <Link to="/register" className="hover:text-white transition-colors duration-200">
            Register
          </Link>
        </div>

        {/* Copyright */}
        <span className="text-sm text-white/40">
          © {year} UptimeFlux
        </span>
      </div>
    </footer>
  );
}
