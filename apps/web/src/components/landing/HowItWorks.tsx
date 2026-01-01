export default function HowItWorks() {
  return (
    <section className="relative bg-neutral-950 py-24 overflow-hidden">
      {/* Angular background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-[15%] w-[40%] h-[60%] bg-gradient-to-r from-red-600/8 to-transparent -skew-x-[10deg] blur-2xl" />
        <div className="absolute right-0 top-[20%] w-[40%] h-[60%] bg-gradient-to-l from-red-600/8 to-transparent skew-x-[10deg] blur-2xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-[10px] sm:text-sm tracking-[0.3em] text-gray-400 mb-4">
            HOW IT WORKS
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Monitoring that just works.
            <span className="block bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent mt-2">
              Set it up once. Stay informed always.
            </span>
          </h3>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

          {/* Step 1 */}
          <div className="relative rounded-xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <span className="absolute -top-4 left-6 rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] group-hover:scale-105 transition-all duration-300">
              01
            </span>
            <h4 className="mt-4 text-lg font-medium text-white mb-2 group-hover:text-white">
              Add your website URL
            </h4>
            <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
              Enter the URL or endpoint you want to monitor. No complex setup,
              no configuration files.
            </p>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <span className="absolute -top-4 left-6 rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] group-hover:scale-105 transition-all duration-300">
              02
            </span>
            <h4 className="mt-4 text-lg font-medium text-white mb-2 group-hover:text-white">
              We monitor it continuously
            </h4>
            <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
              UptimeFlux checks your service at regular intervals and tracks
              availability in real time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <span className="absolute -top-4 left-6 rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] group-hover:scale-105 transition-all duration-300">
              03
            </span>
            <h4 className="mt-4 text-lg font-medium text-white mb-2 group-hover:text-white">
              Get alerted when it goes down
            </h4>
            <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
              The moment downtime is detected, you receive instant alerts so
              you can take action immediately.
            </p>
          </div>

        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
    </section>
  );
}
