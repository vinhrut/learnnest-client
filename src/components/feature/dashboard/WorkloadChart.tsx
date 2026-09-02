export interface WorkloadData {
  name: string;
  value: number;
}

export interface WorkloadChartProps {
  data?: WorkloadData[];
  title?: string;
}

export function WorkloadChart({
  data = [
    { name: 'Nguyễn Văn A', value: 85 },
    { name: 'Trần Thị B', value: 60 },
    { name: 'Lê Văn C', value: 95 },
    { name: 'Phạm Thị D', value: 40 },
    { name: 'Hoàng Văn E', value: 70 },
    { name: 'Ngô Thị F', value: 55 },
  ],
  title = 'Khối lượng công việc theo nhân viên',
}: WorkloadChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
      <h3 className="mb-4 text-headline-sm text-on-surface font-semibold">
        {title}
      </h3>
      <div className="relative h-64 border-b border-l border-outline-variant">
        <div className="absolute inset-0 flex items-end justify-around px-4">
          {data.map((item, index) => (
            <div
              key={index}
              className="group relative flex flex-col items-center"
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden items-center gap-1 whitespace-nowrap rounded bg-inverse-surface px-2 py-1 text-xs text-on-primary group-hover:flex">
                {item.name}: {item.value} tasks
              </div>
              <div
                className="w-12 cursor-pointer rounded-t bg-primary opacity-90 transition-all hover:opacity-100"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-1 text-label-md text-on-surface-variant">
            <div className="h-2 w-2 rounded bg-primary" />
            <span className="truncate max-w-[80px]">{item.name.split(' ').pop()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
