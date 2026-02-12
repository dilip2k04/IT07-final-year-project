import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getUser, logout as doLogout } from "@/lib/auth";

import {
  LayoutDashboard,
  Users,
  Building2,
  FolderKanban,
  CheckSquare,
  Bot,
  LogOut,
} from "lucide-react";
import Meetings from "@/pages/common/Meetings";

/* =========================
   MAIN LAYOUT
========================= */
export default function DashboardLayout() {
  const user = getUser();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    navigate("/login");
    return null;
  }

  const logout = () => {
    doLogout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-zinc-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-zinc-900 text-white flex flex-col shadow-xl">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 font-bold text-lg border-b border-zinc-800">
          Company AI
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-zinc-800 text-sm text-zinc-300">
          <div className="font-medium text-white">{user.name}</div>
          <div className="capitalize text-xs mt-1">
            {user.role.replace("_", " ").toLowerCase()}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <SidebarLinks role={user.role} location={location} />
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-zinc-800">
          <Button
            variant="destructive"
            className="w-full flex items-center gap-2"
            onClick={logout}
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-white shadow-sm border-b flex items-center px-8">
          <h1 className="font-semibold text-lg capitalize">
            {user.role.replace("_", " ")} Dashboard
          </h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* =========================
   SIDEBAR LINKS
========================= */
function SidebarLinks({ role, location }) {
  const links = {
    CEO: [
      { label: "Dashboard", path: "", icon: LayoutDashboard },
      { label: "Departments", path: "departments", icon: Building2 },
      { label: "Users", path: "users", icon: Users },
      { label: "Projects", path: "projects", icon: FolderKanban },
      { label: "AI Assistant", path: "ai", icon: Bot },
      { label: "Meetings", path: "meetings", icon: Bot }

    ],
    DEPARTMENT_HEAD: [
      { label: "Dashboard", path: "", icon: LayoutDashboard },
      { label: "Projects", path: "projects", icon: FolderKanban },
      { label: "AI Assistant", path: "ai", icon: Bot },
      { label: "Meetings", path: "meetings", icon: Bot }
    ],
    TEAM_LEAD: [
      { label: "Dashboard", path: "", icon: LayoutDashboard },
      { label: "My Projects", path: "projects", icon: FolderKanban },
      { label: "AI Assistant", path: "ai", icon: Bot },
      { label: "Meetings", path: "meetings", icon: Bot }
    ],
    EMPLOYEE: [
      { label: "Dashboard", path: "", icon: LayoutDashboard },
      { label: "My Tasks", path: "tasks", icon: CheckSquare },
      { label: "AI Assistant", path: "ai", icon: Bot },
      { label: "Meetings", path: "meetings", icon: Bot }
    ],
  };

  return (
    <>
      {links[role]?.map((l) => {
        const Icon = l.icon;
        const active = location.pathname.endsWith(l.path);

        return (
          <Link
            key={l.label}
            to={l.path}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
              ${
                active
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }
            `}
          >
            <Icon size={18} />
            {l.label}
          </Link>
        );
      })}
    </>
  );
}
