// App.jsx - CORRECTED WITH IMPORTS
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

/* Dashboards */
import CeoDashboard from "./pages/dashboards/CeoDashboard";
import DepartmentHeadDashboard from "./pages/dashboards/DepartmentHeadDashboard";
import TlDashboard from "./pages/dashboards/TlDashboard";
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";

/* CEO */
import Users from "./pages/ceo/Users";
import Departments from "./pages/ceo/Departments";
import Projects from "./pages/ceo/Projects";

/* Department Head */
import DepartmentHeadProjects from "./pages/departmentHead/DepartmentHeadProjects";

/* Team Lead */
import TlProjects from "./pages/teamLead/TlProjects";
import ProjectTasks from "./pages/teamLead/ProjectTasks";

/* Employee */
import MyTasks from "./pages/employee/MyTasks";

/* Documents */
import ProjectDocuments from "./pages/common/ProjectDocuments";

import AIAssistant from "./pages/common/AIAssistant";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* ================= CEO ================= */}
      <Route
        path="/ceo"
        element={
          <ProtectedRoute allowedRoles={["CEO"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CeoDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="departments" element={<Departments />} />
        <Route path="projects" element={<Projects />} />
        <Route path="ai" element={<AIAssistant />} />
      </Route>

      {/* ========== DEPARTMENT HEAD ========== */}
      <Route
        path="/department-head"
        element={
          <ProtectedRoute allowedRoles={["DEPARTMENT_HEAD"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DepartmentHeadDashboard />} />
        <Route path="projects" element={<DepartmentHeadProjects />} />
        <Route path="ai" element={<AIAssistant />} />
      </Route>

      {/* ============= TEAM LEAD ============= */}
      <Route
        path="/team-lead"
        element={
          <ProtectedRoute allowedRoles={["TEAM_LEAD"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<TlDashboard />} />
        <Route path="projects" element={<TlProjects />} />
        <Route path="projects/:projectId/tasks" element={<ProjectTasks />} />
        <Route path="ai" element={<AIAssistant />} />
      </Route>

      {/* ============= EMPLOYEE ============= */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="ai" element={<AIAssistant />} />
      </Route>

      {/* ============= PROJECT DOCUMENTS (ALL ROLES) ============= */}
      <Route
        path="/projects/:projectId/documents"
        element={
          <ProtectedRoute
            allowedRoles={[
              "CEO",
              "DEPARTMENT_HEAD",
              "TEAM_LEAD",
              "EMPLOYEE",
            ]}
          >
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProjectDocuments />} />
      </Route>

      <Route path="*" element={<Login />} />
    </Routes>
  );
}