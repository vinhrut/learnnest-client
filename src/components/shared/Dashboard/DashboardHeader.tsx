const DashboardHeader = () => {
  return (
    <div className="mb-6 flex items-center justify-between">

      <div>
        <h1 className="text-2xl font-semibold text-[#051A3E]">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-[#434654]">
          Tổng quan tình hình dự án và công việc.
        </p>
      </div>

      <button className="flex items-center gap-2 rounded border border-[#C3C6D6] bg-white px-4 py-2 text-sm font-semibold text-[#42526E] shadow-sm hover:bg-[#F1F3FF]">
        <span className="material-symbols-outlined text-[18px]">
          download
        </span>

        Xuất báo cáo (PDF/Excel)
      </button>

    </div>
  );
};

export default DashboardHeader;