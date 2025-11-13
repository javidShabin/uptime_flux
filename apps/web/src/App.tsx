function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
        <span className="rounded-full border border-slate-800 bg-slate-900 px-4 py-1 text-sm font-medium text-slate-300 shadow-lg shadow-slate-900/50">
          apps/web · React + Tailwind
        </span>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Welcome to your new React + TypeScript frontend
          </h1>
          <p className="text-base text-slate-300 sm:text-lg">
            Tailwind CSS is ready to help you ship delightful interfaces.
            Start building by editing <code className="rounded bg-slate-900 px-2 py-1">src/App.tsx</code>.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="https://tailwindcss.com/docs/installation"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
          >
            Tailwind Docs
          </a>
          <a
            href="https://vite.dev/guide/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white"
          >
            Vite Guide
          </a>
        </div>
      </div>
    </main>
  )
}

export default App
