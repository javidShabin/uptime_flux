import { ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-neutral-900 border-r border-white/10 z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between">
            <Link to="/dashboard" className="text-lg sm:text-xl font-bold text-white">
              Uptime<span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">Flux</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-2">
            <Link
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Dashboard</span>
            </Link>
            <Link
              to="/dashboard/monitors"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Monitors</span>
            </Link>
            <Link
              to="/dashboard/incidents"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Incidents</span>
            </Link>
          </nav>

          {/* User section */}
          <div className="p-3 sm:p-4 border-t border-white/10">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg bg-white/5 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 font-semibold text-sm sm:text-base">
                  {user?.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  {user?.email || "User"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium text-sm sm:text-base">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-neutral-950/90 backdrop-blur-xl border-b border-white/10">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <button className="px-3 sm:px-4 py-2 rounded-lg border border-white/20 text-white/80 hover:text-white hover:border-white/40 transition-all duration-200 text-xs sm:text-sm">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
