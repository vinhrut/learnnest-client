import { FiDownload, FiRefreshCw } from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatCard } from './StatCard';
import type { DashboardOverview as DashboardOverviewData } from '@/types/analytics';

const STATUS_ROWS = [
  { key: 'new', label: 'Mới', color: 'bg-primary' },
  { key: 'doing', label: 'Đang làm', color: 'bg-warning' },
  { key: 'done', label: 'Hoàn thành', color: 'bg-success' },
  { key: 'closed', label: 'Đã đóng', color: 'bg-success-container' },
  { key: 'waitingApproval', label: 'Chờ duyệt', color: 'bg-warning-soft' },
  { key: 'rejected', label: 'Bị từ chối', color: 'bg-error' },
  { key: 'draft', label: 'Nháp', color: 'bg-outline' },
] as const;

const PRIORITY_ROWS = [
  { key: 'urgent', label: 'Khẩn cấp', color: 'bg-error' },
  { key: 'high', label: 'Cao', color: 'bg-danger' },
  { key: 'medium', label: 'Trung bình', color: 'bg-warning' },
  { key: 'low', label: 'Thấp', color: 'bg-outline' },
] as const;

interface DashboardOverviewProps {
  data?: DashboardOverviewData;
  loading?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  exporting?: boolean;
}

export function DashboardOverview({
  data,
  loading = false,
  onRefresh,
  onExport,
  exporting = false,
}: DashboardOverviewProps) {
  const status = data?.status;
  const priority = data?.priority;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="secondary" leftIcon={<FiRefreshCw />} onClick={onRefresh}>
          Tai lai
        </Button>
        <Button
          variant="secondary"
          leftIcon={<FiDownload />}
          onClick={onExport}
          loading={exporting}
        >
          Xuat Excel
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Tổng task" value={data?.totalTasks ?? 0} tone="primary" loading={loading} />
        <StatCard label="Cần làm" value={status?.new ?? 0} tone="neutral" loading={loading} />
        <StatCard label="Đang làm" value={status?.doing ?? 0} tone="warning" loading={loading} />
        <StatCard label="Hoàn thành" value={(status?.done ?? 0) + (status?.closed ?? 0)} tone="success" loading={loading} />
        <StatCard label="Quá hạn" value={data?.deadline.overdue ?? 0} tone="danger" loading={loading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BreakdownCard
          title="Trang thai cong viec"
          rows={STATUS_ROWS.map((row) => ({
            label: row.label,
            value: status?.[row.key] ?? 0,
            color: row.color,
          }))}
          total={data?.totalTasks ?? 0}
          loading={loading}
        />

        <BreakdownCard
          title="Muc do uu tien"
          rows={PRIORITY_ROWS.map((row) => ({
            label: row.label,
            value: priority?.[row.key] ?? 0,
            color: row.color,
          }))}
          total={data?.totalTasks ?? 0}
          loading={loading}
        />
      </div>

      <Card title="Deadline">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4">
            <p className="text-label-md font-semibold uppercase text-on-surface-variant">
              Quá hạn
            </p>
            <p className="mt-2 text-headline-md font-bold text-error">
              {loading ? '-' : (data?.deadline.overdue ?? 0).toLocaleString('vi-VN')}
            </p>
          </div>
          <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4">
            <p className="text-label-md font-semibold uppercase text-on-surface-variant">
              Đến hạn trong 24h
            </p>
            <p className="mt-2 text-headline-md font-bold text-warning">
              {loading ? '-' : (data?.deadline.dueSoon ?? 0).toLocaleString('vi-VN')}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BreakdownCard({
  title,
  rows,
  total,
  loading,
}: {
  title: string;
  rows: Array<{ label: string; value: number; color: string }>;
  total: number;
  loading: boolean;
}) {
  const safeTotal = total || 1;

  return (
    <Card title={title}>
      <div className="space-y-4">
        {rows.map((row) => {
          const percent = Math.round((row.value / safeTotal) * 100);
          return (
            <div key={row.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-body-md">
                <span className="font-medium text-on-surface">{row.label}</span>
                <span className="text-on-surface-variant">
                  {loading ? '-' : `${row.value.toLocaleString('vi-VN')} (${percent}%)`}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                <div
                  className={`h-full ${row.color}`}
                  style={{ width: loading ? '0%' : `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
