import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] bg-neutral-950 overflow-hidden">

      {/* ================= ANGULAR BACKGROUND ================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* LEFT – BACK */}
        <div className="
          absolute -left-48 top-[20%]
          w-[70%] h-[70%]
          bg-gradient-to-r from-red-600/20 via-red-500/10 to-transparent
          -skew-x-[20deg] blur-3xl
          animate-slide-left
          hidden sm:block
        " />

        {/* LEFT – MID */}
        <div className="
          absolute left-0 top-[28%]
          w-[50%] sm:w-[38%]
          h-[45%] sm:h-[55%]
          bg-red-600/15 border-r border-red-500/30
          -skew-x-[14deg] sm:-skew-x-[18deg]
          animate-slide-left [animation-delay:200ms]
          animate-float-slow
        " />

        {/* LEFT – FRONT */}
        <div className="
          absolute left-0 top-[34%]
          w-[40%] sm:w-[28%]
          h-[38%] sm:h-[45%]
          bg-gradient-to-r from-red-500/40 to-transparent
          -skew-x-[18deg] sm:-skew-x-[24deg]
          animate-slide-left [animation-delay:350ms]
        " />

        {/* RIGHT – BACK */}
        <div className="
          absolute -right-48 top-[22%]
          w-[70%] h-[70%]
          bg-gradient-to-l from-red-600/20 via-red-500/10 to-transparent
          skew-x-[20deg] blur-3xl
          animate-slide-right
          hidden sm:block
        " />

        {/* RIGHT – MID */}
        <div className="
          absolute right-0 top-[32%]
          w-[50%] sm:w-[38%]
          h-[45%] sm:h-[55%]
          bg-red-600/15 border-l border-red-500/30
          skew-x-[14deg] sm:skew-x-[18deg]
          animate-slide-right [animation-delay:200ms]
          animate-float-slow
        " />

        {/* RIGHT – FRONT */}
        <div className="
          absolute right-0 top-[38%]
          w-[40%] sm:w-[28%]
          h-[38%] sm:h-[45%]
          bg-gradient-to-l from-red-500/40 to-transparent
          skew-x-[18deg] sm:skew-x-[24deg]
          animate-slide-right [animation-delay:350ms]
        " />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-5 sm:px-6 text-center">

        {/* Badge */}
        <div className="
          mb-6 sm:mb-8
          inline-flex items-center gap-2 sm:gap-3
          rounded-md border border-white/15 bg-white/5
          px-4 py-2 backdrop-blur
        ">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rotate-45" />
          <span className="text-xs sm:text-sm text-white/80 tracking-wide">
            Real-time Uptime & Incident Monitoring
          </span>
        </div>

        {/* Headline */}
        <h2 className="
          text-gray-400
          text-[10px] sm:text-sm
          tracking-[0.3em]
          mb-3 sm:mb-4
        ">
          MONITOR • ALERT • RECOVER
        </h2>

        <h1 className="
          max-w-4xl
          text-white
          text-3xl sm:text-5xl lg:text-7xl
          font-bold leading-tight
        ">
          Know When Your
          <span className="block bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
            Services Go Down
          </span>
        </h1>

        {/* Description */}
        <p className="
          mt-5 sm:mt-6
          max-w-xl sm:max-w-3xl
          text-white/70
          text-sm sm:text-lg
          leading-relaxed
        ">
          UptimeFlux continuously monitors your APIs, websites, and services.
          Detect downtime instantly, track incidents in real time,
          and get alerted before your users are impacted.
        </p>

        {/* CTA */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Link
            to="/register"
            className="
              w-full sm:w-auto
              px-8 py-4 rounded-lg
              bg-red-600 text-white font-medium
              shadow-[0_0_45px_rgba(239,68,68,0.45)]
              hover:shadow-[0_0_70px_rgba(239,68,68,0.65)]
              transition
            "
          >
            Start Monitoring →
          </Link>

          <Link
            to="/login"
            className="
              w-full sm:w-auto
              px-8 py-4 rounded-lg
              border border-white/20
              text-white/80 hover:text-white
              hover:border-white/40
              transition
            "
          >
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px
        bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
    </section>
  );
}
