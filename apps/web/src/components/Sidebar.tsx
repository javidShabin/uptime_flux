import { NavLink } from "react-router-dom";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `block px-4 py-2 rounded text-sm ${
    isActive
      ? "bg-slate-800 text-white"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 text-xl font-semibold border-b border-slate-800">
        UptimeFlux
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        <NavLink to="/" className={navItemClass}>
          Dashboard
        </NavLink>
        <NavLink to="/monitors" className={navItemClass}>
          Monitors
        </NavLink>
        <NavLink to="/incidents" className={navItemClass}>
          Incidents
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 text-xs text-slate-400">
        © UptimeFlux
      </div>
    </aside>
  );
}
