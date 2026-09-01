import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertList } from '@/components/feature/dashboard/AlertList';
import type { Task } from '@/types/task';

// Mock tasks for AlertList demo
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    code: 'TSK-1042',
    title: 'Hoàn thiện báo cáo tài chính Q3',
    description: '',
    status: 'WAITING_APPROVAL',
    priority: 'HIGH',
    assignment_status: 'WAITING_APPROVAL',
    project_id: 'p1',
    assignee_id: 'u1',
    creator_id: 'u1',
    due_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: {
      id: 'u1',
      username: 'tranb',
      email: 'tranb@email.com',
      full_name: 'Trần Thị B',
      avatar_url: null,
    },
  },
  {
    id: '2',
    code: 'TSK-1045',
    title: 'Duyệt thiết kế giao diện Mobile',
    description: '',
    status: 'WAITING_APPROVAL',
    priority: 'MEDIUM',
    assignment_status: 'WAITING_APPROVAL',
    project_id: 'p1',
    assignee_id: 'u2',
    creator_id: 'u1',
    due_date: new Date(Date.now() + 3600000 * 2).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    assignee: {
      id: 'u2',
      username: 'levc',
      email: 'levc@email.com',
      full_name: 'Lê Văn C',
      avatar_url: null,
    },
  },
];

export function LeaderDashboardPage() {
  const [dueTasks] = useState<Task[]>(MOCK_TASKS);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header>
        <h1 className="text-headline-md text-on-surface font-bold">
          Tổng quan Quản lý
        </h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Hiệu suất dự án và tình trạng công việc hiện tại.
        </p>
      </header>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="secondary" leftIcon="download">
          Xuất báo cáo (PDF/Excel)
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-md text-on-surface-variant">Tổng số Task</span>
            <span className="material-symbols-outlined text-outline text-xl">format_list_bulleted</span>
          </div>
          <div className="text-headline-md text-on-surface font-bold">1,248</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-[#0052CC]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-md text-on-surface-variant">Cần làm</span>
            <span className="material-symbols-outlined text-outline text-xl">pending_actions</span>
          </div>
          <div className="text-headline-md text-on-surface font-bold">342</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-[#FFAB00]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-md text-on-surface-variant">Đang làm</span>
            <span className="material-symbols-outlined text-outline text-xl">hourglass_empty</span>
          </div>
          <div className="text-headline-md text-on-surface font-bold">456</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-[#36B37E]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-md text-on-surface-variant">Đã xong</span>
            <span className="material-symbols-outlined text-outline text-xl">check_circle</span>
          </div>
          <div className="text-headline-md text-on-surface font-bold">412</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-[#FF5630]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label-md text-on-surface-variant">Quá hạn</span>
            <span className="material-symbols-outlined text-[#FF5630] text-xl">error</span>
          </div>
          <div className="text-headline-md text-[#FF5630] font-bold">38</div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Charts (Span 8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Status Chart */}
          <Card title="Phân bổ trạng thái công việc">
            <div className="h-64 flex items-center justify-center border border-dashed border-outline-variant rounded bg-surface-container-lowest">
              <span className="text-on-surface-variant text-body-md">[Biểu đồ Pie Chart]</span>
            </div>
          </Card>
          {/* Workload Chart */}
          <Card title="Khối lượng công việc theo nhân viên">
            <div className="h-64 flex items-end justify-between px-4 border-b border-l border-outline-variant relative">
              {/* Bar chart mockup */}
              <div className="w-12 bg-[#0052CC] h-[80%] rounded-t opacity-90 hover:opacity-100 transition-opacity relative group"></div>
              <div className="w-12 bg-[#0052CC] h-[60%] rounded-t opacity-90 hover:opacity-100 transition-opacity relative group"></div>
              <div className="w-12 bg-[#0052CC] h-[95%] rounded-t opacity-90 hover:opacity-100 transition-opacity relative group"></div>
              <div className="w-12 bg-[#0052CC] h-[40%] rounded-t opacity-90 hover:opacity-100 transition-opacity relative group"></div>
              <div className="w-12 bg-[#0052CC] h-[70%] rounded-t opacity-90 hover:opacity-100 transition-opacity relative group"></div>
              <div className="w-12 bg-[#0052CC] h-[55%] rounded-t opacity-90 hover:opacity-100 transition-opacity relative group"></div>
            </div>
          </Card>
        </div>

        {/* Right: Alerts (Span 4) */}
        <div className="lg:col-span-4">
          <AlertList tasks={dueTasks} />
        </div>
      </div>
    </div>
  );
}
