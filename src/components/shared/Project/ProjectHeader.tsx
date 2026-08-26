const ProjectHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[#051a3e]">
          Dự án
        </h1>

        <p className="mt-1 text-sm text-[#434654]">
          Quản lý và theo dõi tiến độ các dự án hiện tại.
        </p>
      </div>

      <button className="flex items-center gap-2 rounded-lg bg-[#0052CC] px-4 py-2 text-sm font-semibold text-white">
        <span className="material-symbols-outlined">
          add
        </span>

        Tạo dự án mới
      </button>
    </div>
  );
};

export default ProjectHeader;