const kpis = [
  {
    title: "Tổng số Task",
    value: "1,248",
    icon: "format_list_bulleted",
  },
  {
    title: "Cần làm",
    value: "342",
    icon: "pending_actions",
  },
  {
    title: "Đang làm",
    value: "456",
    icon: "hourglass_empty",
  },
  {
    title: "Đã xong",
    value: "412",
    icon: "check_circle",
  },
  {
    title: "Quá hạn",
    value: "38",
    icon: "error",
  },
];

const KpiCards = () => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">

      {kpis.map((item) => (
        <div
          key={item.title}
          className="flex flex-col justify-between rounded border border-[#DFE1E6] bg-white p-4"
        >
          <div className="mb-2 flex items-center justify-between">

            <span className="text-xs font-semibold text-[#434654]">
              {item.title}
            </span>

            <span className="material-symbols-outlined text-[20px] text-[#737685]">
              {item.icon}
            </span>

          </div>

          <div className="text-2xl font-semibold text-[#051A3E]">
            {item.value}
          </div>

        </div>
      ))}

    </div>
  );
};

export default KpiCards;