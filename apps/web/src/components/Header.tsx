import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export const Header = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Features', href: '/features', current: location.pathname === '/features' },
    { name: 'Pricing', href: '/pricing', current: location.pathname === '/pricing' },
    { name: 'About', href: '/about', current: location.pathname === '/about' },
  ]

  // Trust indicators for public header
  const trustStats = {
    monitors: '10K+',
    uptime: '99.9%',
    users: '5K+'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/95 backdrop-blur-md shadow-lg shadow-slate-900/20">
      <nav className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6 flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50 transition-shadow">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold text-slate-100 group-hover:text-sky-400 transition-colors whitespace-nowrap">UptimeFlux</span>
            </Link>

            {/* Trust Stats - Desktop */}
            <div className="hidden xl:flex items-center space-x-2.5 text-xs">
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 whitespace-nowrap backdrop-blur-sm">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                  <svg className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-slate-400">Uptime</span>
                <span className="font-bold text-emerald-400">{trustStats.uptime}</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-br from-sky-500/10 to-blue-600/5 border border-sky-500/20 whitespace-nowrap backdrop-blur-sm">
                <svg className="h-3.5 w-3.5 text-sky-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-slate-400">Monitors</span>
                <span className="font-bold text-sky-400">{trustStats.monitors}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1 xl:space-x-2 flex-1 justify-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap group ${
                  item.current
                    ? 'bg-slate-800/50 text-sky-400 shadow-sm shadow-sky-500/10'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/30'
                }`}
              >
                {item.name}
                {item.current && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-sky-400"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3 flex-shrink-0">
            {/* Quick Links - Desktop */}
            <div className="hidden 2xl:flex items-center space-x-2">
              <Link
                to="/contact"
                className="px-3 py-2 text-sm font-medium text-slate-400 rounded-lg transition-colors hover:bg-slate-800/50 hover:text-slate-200 whitespace-nowrap"
              >
                Contact
              </Link>
              <div className="h-4 w-px bg-slate-800"></div>
            </div>

            {/* Login and Signup Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/login"
                className="px-4 sm:px-5 py-2 text-sm font-medium text-slate-300 rounded-lg transition-all duration-200 hover:bg-slate-800/50 hover:text-slate-100 active:scale-95 whitespace-nowrap border border-transparent hover:border-slate-700/50"
              >
                <span className="hidden sm:inline">Login</span>
                <span className="sm:hidden">Log in</span>
              </Link>
              <Link
                to="/signup"
                className="relative px-4 sm:px-6 lg:px-7 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg transition-all duration-200 hover:from-sky-400 hover:to-blue-500 active:scale-95 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 whitespace-nowrap overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800/50 hover:text-slate-200 active:bg-slate-800/70"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800/50 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Trust Stats */}
            <div className="px-3 sm:px-4 flex items-center space-x-2">
              <div className="flex-1 flex items-center space-x-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 px-3 py-2.5 border border-emerald-500/20 backdrop-blur-sm">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                  <svg className="h-4 w-4 text-emerald-400 flex-shrink-0 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-slate-400">Uptime</span>
                <span className="text-xs font-bold text-emerald-400">{trustStats.uptime}</span>
              </div>
              <div className="flex-1 flex items-center space-x-2 rounded-lg bg-gradient-to-br from-sky-500/10 to-blue-600/5 px-3 py-2.5 border border-sky-500/20 backdrop-blur-sm">
                <svg className="h-4 w-4 text-sky-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-xs text-slate-400">Monitors</span>
                <span className="text-xs font-bold text-sky-400">{trustStats.monitors}</span>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-1 px-3 sm:px-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-base font-medium transition-colors active:bg-slate-800/70 ${
                    item.current
                      ? 'bg-slate-800/50 text-sky-400'
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/30'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="px-3 sm:px-4 pt-3 space-y-2.5 border-t border-slate-800/50">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-4 py-3 text-center text-sm font-medium text-slate-300 rounded-lg transition-all duration-200 hover:bg-slate-800/50 hover:text-slate-100 active:scale-95 border border-slate-800/50 hover:border-slate-700/50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative block w-full px-4 py-3.5 text-center text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg transition-all duration-200 hover:from-sky-400 hover:to-blue-500 active:scale-95 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 focus:ring-offset-slate-950 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

