export default function Problem() {
  return (
    <section className="relative bg-neutral-950 py-24 overflow-hidden">
      {/* Angular background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-[10%] w-[30%] h-[40%] bg-gradient-to-r from-red-600/10 to-transparent -skew-x-[15deg] blur-2xl" />
        <div className="absolute right-0 top-[15%] w-[30%] h-[40%] bg-gradient-to-l from-red-600/10 to-transparent skew-x-[15deg] blur-2xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">

        {/* Section header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-[10px] sm:text-sm tracking-[0.3em] text-gray-400 mb-4">
            THE PROBLEM
          </h2>
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Downtime doesn't announce itself.
            <span className="block bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent mt-2">
              Your users do.
            </span>
          </h3>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          {/* Problem side */}
          <div className="rounded-xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] transition-all duration-300 group">
            <h4 className="text-lg font-medium text-white mb-6">
              Without proper monitoring
            </h4>

            <ul className="space-y-4 text-white/70 text-sm sm:text-base">
              <li className="flex gap-3 group-hover:text-white/80 transition-colors duration-300">
                <span className="text-red-400 font-bold flex-shrink-0">✕</span>
                <span>Your website or API can go down at any time</span>
              </li>
              <li className="flex gap-3 group-hover:text-white/80 transition-colors duration-300">
                <span className="text-red-400 font-bold flex-shrink-0">✕</span>
                <span>You often find out after users complain</span>
              </li>
              <li className="flex gap-3 group-hover:text-white/80 transition-colors duration-300">
                <span className="text-red-400 font-bold flex-shrink-0">✕</span>
                <span>Incidents stay invisible until damage is done</span>
              </li>
            </ul>
          </div>

          {/* Solution side */}
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 sm:p-8 backdrop-blur hover:border-red-500/40 hover:bg-red-500/15 transition-all duration-300 group">
            <h4 className="text-lg font-medium text-white mb-6">
              With UptimeFlux
            </h4>

            <ul className="space-y-4 text-white/80 text-sm sm:text-base">
              <li className="flex gap-3 group-hover:text-white transition-colors duration-300">
                <span className="text-green-400 font-bold flex-shrink-0">✓</span>
                <span>Continuous monitoring of your services</span>
              </li>
              <li className="flex gap-3 group-hover:text-white transition-colors duration-300">
                <span className="text-green-400 font-bold flex-shrink-0">✓</span>
                <span>Instant alerts the moment something breaks</span>
              </li>
              <li className="flex gap-3 group-hover:text-white transition-colors duration-300">
                <span className="text-green-400 font-bold flex-shrink-0">✓</span>
                <span>Clear incident timelines so you act fast</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
    </section>
  );
}
 
    