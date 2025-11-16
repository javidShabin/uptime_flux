import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Check, Wifi, TrendingUp, Activity, Clock, Globe } from 'lucide-react'

export const Hero = () => {
  // Demo status checks data (for non-logged-in users)
  const demoChecks = [
    { name: 'API Endpoint', service: 'api.yourcompany.com', time: 'Just now', status: 'online', color: 'bg-emerald-500' },
    { name: 'Web Service', service: 'www.yourcompany.com', time: '1 min ago', status: 'online', color: 'bg-purple-500' },
    { name: 'Database', service: 'db.yourcompany.com', time: '2 min ago', status: 'online', color: 'bg-pink-500' },
  ]

  return (
    <section className="relative h-[92vh] bg-[#0a0a0a] overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-transparent to-transparent"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Content */}
      <div className="relative mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center h-full">
          {/* Left Section - Marketing Content */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <Badge 
              variant="outline" 
              className="mb-4 w-fit border-purple-500/30 bg-purple-500/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white rounded-lg"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-purple-400 mr-2"></div>
              <span>99.9% Uptime Guarantee</span>
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Stay Ahead with
              <span className="block">Powerful Uptime</span>
              <span className="block">Monitoring</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-white/80 max-w-xl mb-6 leading-relaxed">
              Monitor your infrastructure with real-time status tracking and instant alerts designed to keep your services running smoothly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-4">
              <Button
                asChild
                to="/signup"
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border-0 rounded-lg px-6 py-4 text-sm font-medium shadow-lg shadow-purple-500/30"
              >
                <span className="relative z-10 flex items-center gap-2">
                  GET STARTED
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
              <Button
                asChild
                to="/docs"
                variant="outline"
                size="lg"
                className="border-white/20 bg-transparent backdrop-blur-sm text-white hover:border-white/40 hover:text-white hover:bg-white/5 rounded-lg px-6 py-4 text-sm font-medium"
              >
                <span>LEARN MORE</span>
              </Button>
            </div>

            {/* Bottom Text */}
            <p className="text-white/60 text-xs">We empower reliability</p>
          </div>

          {/* Right Section - Dashboard Widgets */}
          <div className="relative h-full flex items-center">
            <div className="grid grid-cols-2 gap-3 w-full max-h-full overflow-hidden">
              {/* Top Row - Uptime Overview Widget */}
              <Card className="col-span-1 group relative bg-gradient-to-br from-white/10 via-purple-500/5 to-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-purple-500/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10 after:absolute after:inset-[1px] after:rounded-2xl after:bg-gradient-to-br after:from-transparent after:to-black/30 after:pointer-events-none">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      Uptime Overview
                    </h3>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] px-1.5 py-0.5">DEMO</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-white/60 text-xs px-2 py-1 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">Year</span>
                    <span className="text-white text-xs px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse"></div>
                      Today
                    </span>
                    <span className="text-white/60 text-xs px-2 py-1 rounded-lg bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">This Week</span>
                  </div>
                  <div className="relative w-full h-28 flex items-center justify-center mb-3">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#gradient-purple)"
                        strokeWidth="8"
                        strokeDasharray={`${99.9 * 2.51} ${100 * 2.51}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="50%" stopColor="#ec4899" />
                          <stop offset="100%" stopColor="#f472b6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">99.9%</span>
                      <span className="text-white/60 text-xs mt-1">Average Uptime</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-white/60">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span>Demo Dashboard</span>
                    </div>
                    <div className="text-purple-400 cursor-pointer hover:text-purple-300 transition-colors font-medium">
                      Sign Up →
                    </div>
                  </div>
                </div>
              </Card>

              {/* Top Row - Recent Checks Widget */}
              <Card className="col-span-1 group relative bg-gradient-to-br from-white/10 via-pink-500/5 to-white/5 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-4 shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-pink-500/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10 after:absolute after:inset-[1px] after:rounded-2xl after:bg-gradient-to-br after:from-transparent after:to-black/30 after:pointer-events-none">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                      <Activity className="h-4 w-4 text-pink-400" />
                      Live Monitoring
                    </h3>
                    <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/40 text-[10px] px-1.5 py-0.5">PREVIEW</Badge>
                  </div>
                  <div className="space-y-2.5">
                    {demoChecks.map((check, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                        <div className={`w-9 h-9 rounded-lg ${check.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg`}>
                          {check.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white text-xs font-semibold truncate">{check.name}</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          </div>
                          <p className="text-white/60 text-xs truncate">{check.service}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-white/80 text-xs whitespace-nowrap font-medium">{check.time}</span>
                          <span className="text-emerald-400 text-[10px]">{check.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-white/40 text-[10px] text-center">Example monitoring data</p>
                  </div>
                </div>
              </Card>

              {/* Bottom Row - Primary Monitor Widget (Left, Larger) */}
              <Card className="col-span-1 group relative bg-gradient-to-br from-purple-600/30 via-pink-600/25 to-purple-500/25 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-4 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/40 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 overflow-hidden before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-purple-500/30 before:via-pink-500/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 after:absolute after:inset-[1px] after:rounded-2xl after:bg-gradient-to-br after:from-transparent after:to-black/40 after:pointer-events-none">
                <div className="absolute top-2 left-2 z-10">
                  <div className="w-7 h-6 bg-yellow-400/40 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg shadow-yellow-400/30 border border-yellow-400/30">
                    <Wifi className="h-3.5 w-3.5 text-yellow-300" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-purple-500/30 text-purple-200 border-purple-400/40 text-[10px] px-2 py-0.5">DEMO</Badge>
                </div>
                <div className="relative z-10 mt-8">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-purple-300 text-xs font-medium">Example Monitor</p>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 text-[10px] px-1.5 py-0.5">SAMPLE</Badge>
                  </div>
                  <p className="text-white text-lg font-mono mb-2 drop-shadow-lg font-semibold">api.yourcompany.com</p>
                  <p className="text-white/70 text-xs font-medium mb-3">Your API Endpoint</p>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-emerald-400 text-xs font-semibold">Online</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-purple-400 text-sm font-bold">99.9%</span>
                      <span className="text-white/60 text-[10px]">Uptime</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Response: 23ms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      <span>12 Regions</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Bottom Row - Right Side: Two Smaller Cards */}
              <div className="col-span-1 flex flex-col gap-3">
                {/* Secondary Monitor Widget */}
                <Card className="group relative bg-gradient-to-br from-white/10 via-purple-500/5 to-white/5 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-3 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-purple-500/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10 after:absolute after:inset-[1px] after:rounded-2xl after:bg-gradient-to-br after:from-transparent after:to-black/30 after:pointer-events-none">
                  <div className="relative z-10">
                    <div className="mb-3">
                      <div className="w-7 h-7 bg-purple-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center mb-1.5 shadow-lg shadow-purple-500/20 border border-purple-400/30">
                        <span className="text-purple-400 font-bold text-xs">WEB</span>
                      </div>
                      <h3 className="text-white font-semibold text-xs mb-0.5">Web Service</h3>
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>Demo data</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white text-xl font-bold drop-shadow-lg">99.9%</p>
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                </Card>

                {/* Third Monitor Widget */}
                <Card className="group relative bg-gradient-to-br from-white/10 via-pink-500/5 to-white/5 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-3 shadow-2xl shadow-pink-500/20 hover:shadow-pink-500/30 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-pink-500/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 before:-z-10 after:absolute after:inset-[1px] after:rounded-2xl after:bg-gradient-to-br after:from-transparent after:to-black/30 after:pointer-events-none">
                  <div className="relative z-10">
                    <div className="mb-3">
                      <div className="w-7 h-7 bg-pink-500/30 backdrop-blur-sm rounded-lg flex items-center justify-center mb-1.5 shadow-lg shadow-pink-500/20 border border-pink-400/30">
                        <span className="text-pink-400 font-bold text-xs">DB</span>
                      </div>
                      <h3 className="text-white font-semibold text-xs mb-0.5">Database</h3>
                      <div className="flex items-center gap-2 text-white/60 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>Demo data</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-white text-xl font-bold drop-shadow-lg">100%</p>
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Purple Checkmark Icon */}
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


