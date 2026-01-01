const features = [
  "Real-time uptime monitoring",
  "Instant email alerts",
  "Incident history & tracking",
  "Reliable background workers",
];

export default function Features() {
  return (
    <section className="relative bg-neutral-950 py-24 overflow-hidden">
      {/* Angular background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-[20%] w-[35%] h-[50%] bg-gradient-to-r from-red-600/8 to-transparent -skew-x-[12deg] blur-2xl" />
        <div className="absolute right-0 top-[25%] w-[35%] h-[50%] bg-gradient-to-l from-red-600/8 to-transparent skew-x-[12deg] blur-2xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-[10px] sm:text-sm tracking-[0.3em] text-gray-400 mb-4">
            KEY FEATURES
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Everything you need to stay online.
            <span className="block bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent mt-2">
              Nothing you don't.
            </span>
          </h3>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Feature 1 */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-2.5 h-2.5 bg-red-500 rotate-45 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-lg font-medium text-white mb-2 group-hover:text-white">
              Real-time Uptime Monitoring
            </h4>
            <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
              Continuous health checks for your websites, APIs, and services —
              detect downtime the moment it happens.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-2.5 h-2.5 bg-red-500 rotate-45 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-lg font-medium text-white mb-2 group-hover:text-white">
              Instant Email Alerts
            </h4>
            <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
              Get notified immediately when a service goes down so you can
              respond before users are affected.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-2.5 h-2.5 bg-red-500 rotate-45 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-lg font-medium text-white mb-2 group-hover:text-white">
              Incident History & Timelines
            </h4>
            <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
              Track every incident with clear timelines to understand what
              happened, when it happened, and how long it lasted.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-2.5 h-2.5 bg-red-500 rotate-45 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-lg font-medium text-white mb-2 group-hover:text-white">
              Secure Authentication
            </h4>
            <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
              JWT-based authentication ensures your monitoring data stays
              protected and access is tightly controlled.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-2.5 h-2.5 bg-red-500 rotate-45 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-lg font-medium text-white mb-2 group-hover:text-white">
              Scalable Background Workers
            </h4>
            <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
              Built with background job processing to scale monitoring checks
              reliably as your infrastructure grows.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
    </section>
  );
}
