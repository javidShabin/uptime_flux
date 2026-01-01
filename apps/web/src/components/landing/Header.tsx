import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 w-full z-50 bg-neutral-950/90 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white hover:opacity-80 transition-opacity duration-200">
          Uptime<span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">Flux</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/login"
            className="text-white/70 hover:text-white transition-colors duration-200 text-sm sm:text-base"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 sm:px-6 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 active:scale-95 transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] text-sm sm:text-base"
          >
            Join Us
          </Link>
        </div>
      </div>
    </header>
  );
}
