import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layouts/Mainlayouts";
import DashboardPage from "../components/shared/Dashboard/DashboardPage";
import ProjectsPage from "../components/shared/Project/ProjectPage";
import MyTasksPage from "../components/shared/Tasks/TaskPage";


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/tasks" element={<MyTasksPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 