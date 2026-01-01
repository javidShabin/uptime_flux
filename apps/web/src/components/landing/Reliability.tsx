export default function Reliability() {
  return (
    <section className="relative bg-neutral-950 py-20 overflow-hidden">
      {/* Angular background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-[10%] w-[35%] h-[50%] bg-gradient-to-r from-red-600/8 to-transparent -skew-x-[12deg] blur-2xl" />
        <div className="absolute right-0 top-[15%] w-[35%] h-[50%] bg-gradient-to-l from-red-600/8 to-transparent skew-x-[12deg] blur-2xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-[10px] sm:text-sm tracking-[0.3em] text-gray-400 mb-4">
            RELIABILITY
          </h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Built for production environments.
          </h3>
        </div>

        {/* Trust points */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-2.5 h-2.5 bg-red-500 rotate-45 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
              Designed to handle real-world production workloads without
              compromising performance or accuracy.
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-2.5 h-2.5 bg-red-500 rotate-45 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
              Background workers ensure monitoring checks and alerts run
              reliably, even under heavy load.
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-6 backdrop-blur hover:border-white/25 hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300 group">
            <div className="w-2.5 h-2.5 bg-red-500 rotate-45 mb-4 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors duration-300">
              Secure, isolated architecture protects your data and ensures
              strict access control at every layer.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
    </section>
  );
}
