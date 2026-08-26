import { NavLink } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: "dashboard",
    path: "/dashboard",
  },
  {
    label: "Projects",
    icon: "folder_shared",
    path: "/projects",
  },
  {
    label: "My Tasks",
    icon: "assignment_ind",
    path: "/tasks",
  },
  {
    label: "User Management",
    icon: "group",
    path: "/users",
  },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-full w-[240px] flex-col border-r border-[#C3C6D6] bg-white px-4 py-6 md:flex">
      
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-[#0052CC] text-white">
          ✓
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#003D9B]">
            TaskMaster Pro
          </h1>

          <p className="text-xs font-semibold tracking-wide text-[#434654]">
            Management Suite
          </p>
        </div>
      </div>

      {/* Create Task */}
      <button className="mb-6 flex w-full items-center justify-center gap-2 rounded bg-[#0052CC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003D9B]">
        <span className="material-symbols-outlined text-[18px]">
          add
        </span>

        Create Task
      </button>

      {/* Main menu */}
      <div className="flex flex-1 flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded px-3 py-2 text-sm transition ${
                isActive
                  ? "border-r-2 border-[#003D9B] bg-[#E1E8FF] font-bold text-[#003D9B]"
                  : "text-[#434654] hover:bg-[#E9EDFF]"
              }`
            }
          >
            <span className="material-symbols-outlined">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom menu */}
      <div className="flex flex-col gap-1 border-t border-[#C3C6D6] pt-4">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded px-3 py-2 text-sm text-[#434654] hover:bg-[#E9EDFF]"
        >
          <span className="material-symbols-outlined">
            settings
          </span>

          Settings
        </NavLink>

        <NavLink
          to="/help"
          className="flex items-center gap-3 rounded px-3 py-2 text-sm text-[#434654] hover:bg-[#E9EDFF]"
        >
          <span className="material-symbols-outlined">
            help
          </span>

          Help
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;