const features = [
  "Real-time uptime monitoring",
  "Instant email alerts",
  "Incident history & tracking",
  "Reliable background workers",
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center">Core Features</h2>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {features.map((f) => (
            <div
              key={f}
              className="p-6 border border-slate-800 rounded-xl bg-slate-900"
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
