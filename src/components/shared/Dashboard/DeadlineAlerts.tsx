const alerts = [
  {
    id: "TSK-1042",
    title: "Hoàn thiện báo cáo tài chính Q3",
    deadline: "Hôm nay 15:00",
    user: "Lê Văn C",
    type: "danger",
  },
  {
    id: "TSK-1048",
    title: "Review Q3 Campaign Assets",
    deadline: "Hôm nay 18:00",
    user: "Nguyễn Văn A",
    type: "warning",
  },
  {
    id: "TSK-1050",
    title: "Họp kickoff dự án mới",
    deadline: "Ngày mai 09:00",
    user: "Kiều Trinh",
    type: "warning",
  },
];

const DeadlineAlerts = () => {
  return (
    <div className="flex h-full flex-col rounded border border-[#DFE1E6] bg-white">

      <div className="flex items-center justify-between border-b border-[#DFE1E6] p-4">

        <h3 className="flex items-center gap-2 text-xl font-semibold">
          <span className="material-symbols-outlined text-[#FF5630]">
            warning
          </span>

          Đến hạn trong 24h
        </h3>

        <span className="rounded-full bg-[#FFEBE6] px-2 py-1 text-xs font-semibold text-[#DE350B]">
          12 Tasks
        </span>

      </div>

      <div className="flex-1 overflow-y-auto">

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border-b border-[#DFE1E6] p-4"
          >

            <div className="flex justify-between">

              <span className="font-mono text-xs text-[#434654]">
                {alert.id}
              </span>

              <span className="text-[10px] font-bold uppercase text-[#FF5630]">
                {alert.deadline}
              </span>

            </div>

            <h4 className="mt-1 font-semibold">
              {alert.title}
            </h4>

            <div className="mt-2 text-xs text-[#434654]">
              {alert.user}
            </div>

          </div>
        ))}

      </div>

      <div className="border-t border-[#DFE1E6] p-3 text-center">
        <button className="text-xs font-semibold text-[#0052CC]">
          Xem tất cả công việc sắp đến hạn
        </button>
      </div>

    </div>
  );
};

export default DeadlineAlerts;