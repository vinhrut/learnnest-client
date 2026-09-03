import type { ReactNode } from 'react';
import { FiCalendar, FiClock, FiMail, FiPhone } from 'react-icons/fi';
import { Card } from '@/components/ui/Card';
import type { User } from '@/types/user';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function InfoRow({
  icon,
  label,
  value,
  breakAll = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  breakAll?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-container text-base text-on-surface-variant">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-label-md text-on-surface-variant">{label}</dt>
        <dd
          className={`mt-0.5 text-body-md font-semibold text-on-surface ${
            breakAll ? 'break-all' : 'truncate'
          }`}
        >
          {value}
        </dd>
      </div>
    </div>
  );
}

export function ProfileAboutCard({ user }: { user: User }) {
  return (
    <Card title="Liên hệ">
      <dl className="flex flex-col gap-4">
        <InfoRow icon={<FiMail />} label="Email" value={user.email} breakAll />
        <InfoRow icon={<FiPhone />} label="Số điện thoại" value={user.phone || '—'} />
        <InfoRow
          icon={<FiCalendar />}
          label="Ngày tạo"
          value={formatDate(user.created_at)}
        />
        <InfoRow
          icon={<FiClock />}
          label="Cập nhật gần nhất"
          value={formatDate(user.updated_at)}
        />
      </dl>
    </Card>
  );
}
