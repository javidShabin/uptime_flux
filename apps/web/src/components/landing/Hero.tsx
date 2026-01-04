import React from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[100svh] bg-neutral-950 overflow-hidden">

      {/* ================= ANGULAR BACKGROUND ================= */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

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

        {/* Center glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] bg-red-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[100svh] px-5 sm:px-6 text-center">

        {/* Badge */}
        <div className="
          mb-5 sm:mb-7
          inline-flex items-center gap-2 sm:gap-2.5
          rounded-full border border-white/15 bg-white/5
          px-4 sm:px-5 py-2 sm:py-2.5
          backdrop-blur-md
          hover:border-white/25 hover:bg-white/10 hover:scale-105
          transition-all duration-300
          animate-fade-in
        ">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rotate-45 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <span className="text-xs sm:text-sm text-white/90 tracking-wide font-medium">
            Real-time Uptime & Incident Monitoring
          </span>
        </div>

        {/* Headline */}
        <h2 className="
          text-gray-400
          text-[10px] sm:text-xs
          tracking-[0.3em] sm:tracking-[0.35em]
          mb-3 sm:mb-4
          font-medium
          animate-fade-in [animation-delay:100ms]
        ">
          MONITOR • ALERT • RECOVER
        </h2>

        <h1 className="
          max-w-4xl
          text-white
          text-3xl sm:text-4xl lg:text-5xl xl:text-6xl
          font-bold leading-[1.15] sm:leading-tight
          mb-4 sm:mb-5
          animate-fade-in [animation-delay:200ms]
        ">
          Know When Your
          <span className="block bg-gradient-to-r from-red-500 via-red-400 to-red-300 bg-clip-text text-transparent mt-1 sm:mt-2">
            Services Go Down
          </span>
        </h1>

        {/* Description */}
        <p className="
          mt-3 sm:mt-4
          max-w-xl sm:max-w-2xl
          text-white/70 sm:text-white/75
          text-sm sm:text-base lg:text-lg
          leading-relaxed
          animate-fade-in [animation-delay:300ms]
        ">
          UptimeFlux continuously monitors your APIs, websites, and services.
          Detect downtime instantly, track incidents in real time,
          and get alerted before your users are impacted.
        </p>

        {/* CTA */}
        <div className="mt-7 sm:mt-9 lg:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto justify-center animate-fade-in [animation-delay:400ms]">
          <Link
            to="/register"
            className="
              w-full sm:w-auto
              px-7 sm:px-9 py-3.5 sm:py-4
              rounded-lg
              bg-red-600 text-white font-semibold
              text-sm sm:text-base
              shadow-[0_0_40px_rgba(239,68,68,0.4)]
              hover:shadow-[0_0_60px_rgba(239,68,68,0.6)]
              hover:-translate-y-0.5 hover:bg-red-500
              active:scale-95
              transition-all duration-200
              relative overflow-hidden
              group
            "
          >
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              Start Monitoring
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </Link>

          <Link
            to="/login"
            className="
              w-full sm:w-auto
              px-7 sm:px-9 py-3.5 sm:py-4
              rounded-lg
              border-2 border-white/20
              text-white/90 hover:text-white
              font-semibold
              text-sm sm:text-base
              hover:border-white/40 hover:bg-white/10
              active:scale-95
              transition-all duration-200
              backdrop-blur-sm
            "
          >
            View Dashboard
          </Link>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
    </section>
  );
}
