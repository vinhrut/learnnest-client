/**
 * StatusChart - Pie chart placeholder for task status distribution
 *
 * @example
 * <StatusChart
 *   data={[
 *     { label: 'Cần làm', value: 342, color: '#0052CC' },
 *     { label: 'Đang làm', value: 456, color: '#FFAB00' },
 *     { label: 'Đã xong', value: 412, color: '#36B37E' },
 *     { label: 'Quá hạn', value: 38, color: '#FF5630' },
 *   ]}
 * />
 */
export interface StatusChartData {
  label: string;
  value: number;
  color: string;
}

export interface StatusChartProps {
  data?: StatusChartData[];
  title?: string;
}

export function StatusChart({
  data = [
    { label: 'Cần làm', value: 342, color: '#0052CC' },
    { label: 'Đang làm', value: 456, color: '#FFAB00' },
    { label: 'Đã xong', value: 412, color: '#36B37E' },
    { label: 'Quá hạn', value: 38, color: '#FF5630' },
  ],
  title = 'Phân bổ trạng thái công việc',
}: StatusChartProps) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
      <h3 className="mb-4 text-headline-sm text-on-surface font-semibold">
        {title}
      </h3>
      <div className="flex h-64 flex-col items-center justify-center gap-4 rounded border-2 border-dashed border-outline-variant bg-surface-container-low">
        {/* Placeholder for actual chart implementation */}
        <div className="flex gap-6">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-label-md text-on-surface-variant">
                {item.label}: {item.value}
              </span>
            </div>
          ))}
        </div>
        <span className="text-body-md text-on-surface-variant">
          [Biểu đồ Pie Chart]
        </span>
      </div>
    </div>
  );
}
