import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 w-full z-50 bg-neutral-950 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          Uptime<span className="text-red-600">Flux</span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-slate-300 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-red-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-500 transition"
          >
            Join Us
          </Link>
        </div>
      </div>
    </header>
  );
}
