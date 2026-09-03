import { FiCalendar, FiCheckCircle } from 'react-icons/fi';
import type { Project } from '@/types/project';
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_COLOR } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const isCompleted = project.status === 'COMPLETED';
  const statusColorClass = PROJECT_STATUS_COLOR[project.status];
  const statusLabel = PROJECT_STATUS_LABEL[project.status];

  return (
    <div
      onClick={onClick}
      className={`
        group relative flex h-full cursor-pointer flex-col
        overflow-hidden rounded-xl border border-line bg-white p-5
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5
        ${isCompleted ? 'opacity-75 grayscale-[20%]' : ''}
      `}
    >
      {!isCompleted && (
        <div
          className={`absolute left-0 top-0 h-1 w-full ${
            project.status === 'ACTIVE' ? 'bg-green-500' : 'bg-blue-500'
          }`}
        />
      )}

      <div className="mb-4 flex items-start justify-between">
        <h3 className="pr-8 text-lg font-semibold text-ink line-clamp-2">
          {project.name}
        </h3>
        <span
          className={`
            absolute right-5 top-5
            inline-flex items-center rounded px-2 py-1
            text-[10px] font-semibold uppercase
            ${statusColorClass}
          `}
        >
          {statusLabel}
        </span>
      </div>

      <p className="mb-2 text-xs font-medium text-muted">{project.code}</p>

      <p className="mb-6 line-clamp-2 flex-grow text-sm text-muted">
        {project.description || 'Không có mô tả'}
      </p>

      <div className="flex items-center justify-between border-t border-line pt-4">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="font-medium text-ink">{project.code}</span>
        </div>

        <div className="flex items-center gap-1 text-muted">
          {isCompleted ? (
            <FiCheckCircle className="text-[16px]" />
          ) : (
            <FiCalendar className="text-[16px]" />
          )}
          <span className="text-xs font-medium">
            {new Date(project.created_at).toLocaleDateString('vi-VN')}
          </span>
        </div>
      </div>
    </div>
  );
}
