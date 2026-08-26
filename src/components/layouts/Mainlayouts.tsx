import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <Sidebar />

      <Header />

      <main className="pt-[80px] px-6 pb-6 md:ml-[240px]">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;