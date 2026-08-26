const Header = () => {
  return (
    <header className="fixed right-0 top-0 z-30 flex h-[56px] w-full items-center justify-between border-b border-[#C3C6D6] bg-white px-4 md:w-[calc(100%-240px)]">
      
      {/* Search */}
      <div className="flex w-1/3 items-center gap-4">
        <button className="text-[#434654] md:hidden">
          <span className="material-symbols-outlined">
            menu
          </span>
        </button>

        <div className="relative hidden w-full max-w-md md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-[#737685]">
            search
          </span>

          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="h-8 w-full rounded border border-[#DFE1E6] bg-white pl-10 pr-3 text-sm outline-none transition-colors focus:border-[#0052CC] focus:ring-1 focus:ring-[#0052CC]"
          />
        </div>

        {/* Mobile title */}
        <h1 className="text-xl font-black text-[#003D9B] md:hidden">
          TaskMaster
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Notification */}
        <button className="relative rounded-full p-2 text-[#434654] transition hover:bg-[#E9EDFF]">
          <span className="material-symbols-outlined">
            notifications
          </span>

          {/* Notification badge */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#FF5630]" />
        </button>

        {/* Avatar */}
        <button className="flex items-center rounded-full p-2 hover:bg-[#E9EDFF]">
          <img
            src="/avatar.png"
            alt="Manager Profile"
            className="h-8 w-8 rounded-full border border-[#C3C6D6] object-cover"
          />
        </button>

      </div>
    </header>
  );
};

export default Header;