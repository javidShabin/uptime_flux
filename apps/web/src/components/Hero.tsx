import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, Zap, BarChart3, Lock } from 'lucide-react'

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 lg:pb-24">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <Badge 
            variant="outline" 
            className="mb-8 border-slate-800/50 bg-slate-900/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-slate-300 shadow-lg shadow-slate-900/50 hover:border-sky-500/30 transition-colors"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse mr-2"></div>
            <span>99.9% Uptime Guarantee</span>
          </Badge>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-100 leading-tight mb-6 max-w-5xl">
            Monitor Your Infrastructure
            <span className="block bg-gradient-to-r from-sky-400 via-blue-400 to-sky-500 bg-clip-text text-transparent">
              With Confidence
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 max-w-3xl mb-10 sm:mb-12 leading-relaxed">
            Real-time uptime monitoring, instant alerts, and comprehensive analytics. 
            Keep your services running smoothly with <span className="text-slate-300 font-medium">UptimeFlux</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 sm:mb-20">
            <Button
              asChild
              to="/signup"
              variant="gradient"
              size="lg"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Button>
            <Button
              asChild
              to="/docs"
              variant="outline"
              size="lg"
              className="border-slate-700/50 bg-slate-900/30 backdrop-blur-sm text-slate-300 hover:border-slate-600 hover:text-slate-100 hover:bg-slate-800/30"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Documentation
              </span>
            </Button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full max-w-4xl">
            <Card className="bg-slate-900/30 backdrop-blur-sm border-slate-800/50">
              <CardContent className="flex flex-col items-center p-4">
                <div className="text-3xl sm:text-4xl font-bold text-sky-400 mb-1">10K+</div>
                <div className="text-sm text-slate-400">Active Monitors</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 backdrop-blur-sm border-slate-800/50">
              <CardContent className="flex flex-col items-center p-4">
                <div className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-1">99.9%</div>
                <div className="text-sm text-slate-400">Uptime</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 backdrop-blur-sm border-slate-800/50">
              <CardContent className="flex flex-col items-center p-4">
                <div className="text-3xl sm:text-4xl font-bold text-blue-400 mb-1">5K+</div>
                <div className="text-sm text-slate-400">Users</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 backdrop-blur-sm border-slate-800/50">
              <CardContent className="flex flex-col items-center p-4">
                <div className="text-3xl sm:text-4xl font-bold text-purple-400 mb-1">24/7</div>
                <div className="text-sm text-slate-400">Support</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="relative border-t border-slate-800/50 bg-slate-900/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-slate-900/30 border-slate-800/50 hover:border-sky-500/30 transition-colors">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-sky-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Real-time Monitoring</h3>
                <p className="text-sm text-slate-400">Get instant notifications when your services go down</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 border-slate-800/50 hover:border-sky-500/30 transition-colors">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Advanced Analytics</h3>
                <p className="text-sm text-slate-400">Comprehensive insights into your infrastructure health</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900/30 border-slate-800/50 hover:border-sky-500/30 transition-colors">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-200 mb-2">Secure & Reliable</h3>
                <p className="text-sm text-slate-400">Enterprise-grade security with 99.9% uptime SLA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

