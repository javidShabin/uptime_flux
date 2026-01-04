import React from 'react'
import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="relative bg-neutral-950 py-24 overflow-hidden">
      {/* Angular background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-[20%] w-[50%] h-[60%] bg-gradient-to-r from-red-600/15 to-transparent -skew-x-[15deg] blur-3xl" />
        <div className="absolute right-0 top-[25%] w-[50%] h-[60%] bg-gradient-to-l from-red-600/15 to-transparent skew-x-[15deg] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-6 text-center">

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Start monitoring your websites today.
        </h2>

        <p className="text-white/70 max-w-2xl mx-auto mb-10 text-sm sm:text-base">
          Set up monitoring in minutes and get alerted before downtime impacts
          your users.
        </p>

        <Link
          to="/register"
          className="
            inline-flex items-center justify-center
            rounded-lg bg-red-600 px-8 sm:px-10 py-4
            text-white font-medium
            hover:bg-red-500 active:scale-95
            transition-all duration-200
            shadow-[0_0_45px_rgba(239,68,68,0.45)]
            hover:shadow-[0_0_70px_rgba(239,68,68,0.65)]
            hover:-translate-y-0.5
          "
        >
          Start Monitoring →
        </Link>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
    </section>
  )
}
