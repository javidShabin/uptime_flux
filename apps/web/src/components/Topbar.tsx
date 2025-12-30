import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-medium text-slate-800">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          {user?.email}
        </span>

        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
