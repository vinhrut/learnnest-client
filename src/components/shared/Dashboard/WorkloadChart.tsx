const WorkloadChart = () => {
  const bars = [
    "80%",
    "60%",
    "95%",
    "40%",
    "70%",
    "55%",
  ];

  return (
    <div className="rounded border border-[#DFE1E6] bg-white p-6">

      <h3 className="mb-4 text-xl font-semibold text-[#051A3E]">
        Khối lượng công việc theo nhân viên
      </h3>

      <div className="flex h-64 items-end justify-between border-b border-l border-[#C3C6D6] px-4">

        {bars.map((height, index) => (
          <div
            key={index}
            className="w-12 rounded-t bg-[#0052CC]"
            style={{ height }}
          />
        ))}

      </div>

    </div>
  );
};

export default WorkloadChart;