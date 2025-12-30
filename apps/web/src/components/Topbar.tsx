export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-medium text-slate-800">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        {/* User placeholder */}
        <div className="text-sm text-slate-600">
          user@email.com
        </div>

        {/* Logout placeholder */}
        <button className="text-sm text-red-600 hover:underline">
          Logout
        </button>
      </div>
    </header>
  );
}
