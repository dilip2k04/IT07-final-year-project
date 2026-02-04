// DashboardLayout.jsx - Make sure it has export default
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getUser, logout as doLogout } from "@/lib/auth";

function DashboardLayout() {
  const user = getUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const logout = () => {
    doLogout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-zinc-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-zinc-800">
          Company AI
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarLinks role={user.role} />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <Button variant="destructive" className="w-full" onClick={logout}>
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b flex items-center px-6 bg-white">
          <h1 className="font-semibold capitalize">
            {user.role.replace("_", " ")} Dashboard
          </h1>
        </header>

        <main className="flex-1 p-6 bg-zinc-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLinks({ role }) {
  const links = {
    CEO: [
      { label: "Dashboard", path: "" },
      { label: "Departments", path: "departments" },
      { label: "Users", path: "users" },
      { label: "Projects", path: "projects" },
      { label: "AI Assistant", path: "ai" } // Changed from "/ai" to "ai"
    ],
    DEPARTMENT_HEAD: [
      { label: "Dashboard", path: "" },
      { label: "Projects", path: "projects" },
      { label: "AI Assistant", path: "ai" } // Changed from "/ai" to "ai"
    ],
    TEAM_LEAD: [
      { label: "Dashboard", path: "" },
      { label: "My Projects", path: "projects" },
      { label: "AI Assistant", path: "ai" } // Changed from "/ai" to "ai"
    ],
    EMPLOYEE: [
      { label: "Dashboard", path: "" },
      { label: "My Tasks", path: "tasks" },
      { label: "AI Assistant", path: "ai" } // Changed from "/ai" to "ai"
    ],
  };

  return (
    <>
      {links[role]?.map((l) => (
        <Link
          key={l.label}
          to={l.path}
          className="block px-3 py-2 rounded hover:bg-zinc-800"
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}

// MAKE SURE THIS LINE IS AT THE BOTTOM
export default DashboardLayout;