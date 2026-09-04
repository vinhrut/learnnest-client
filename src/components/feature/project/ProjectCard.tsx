import { useState } from 'react';
import { FiCalendar, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { toast } from '@/components/ui/toast';
import { useUpdateProject } from '@/hooks/projects/project.queries';
import type { Project, ProjectStatus } from '@/types/project';
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_COLOR } from '@/types/project';

interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
  canEdit?: boolean;
}

export function ProjectCard({ project, onClick, canEdit = false }: ProjectCardProps) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const updateProject = useUpdateProject();

  const isCompleted = project.status === 'COMPLETED';
  const statusColorClass = PROJECT_STATUS_COLOR[project.status];
  const statusLabel = PROJECT_STATUS_LABEL[project.status];

  const handleStatusChange = async (newStatus: ProjectStatus) => {
    try {
      await updateProject.mutateAsync({
        id: project.id,
        payload: { status: newStatus },
      });
      toast.success('Cập nhật trạng thái thành công!');
      setShowStatusMenu(false);
    } catch {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on status dropdown
    if ((e.target as HTMLElement).closest('.status-dropdown')) {
      return;
    }
    onClick?.();
  };

  return (
    <div
      onClick={handleCardClick}
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

        {/* Status Badge - Clickable if canEdit */}
        <div className="status-dropdown relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (canEdit) setShowStatusMenu(!showStatusMenu);
            }}
            disabled={!canEdit}
            className={`
              inline-flex items-center gap-1 rounded px-2 py-1
              text-[10px] font-semibold uppercase transition-all
              ${statusColorClass}
              ${canEdit ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}
            `}
          >
            {statusLabel}
            {canEdit && <FiChevronDown className="h-3 w-3" />}
          </button>

          {/* Status Dropdown Menu */}
          {showStatusMenu && canEdit && (
            <div
              className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-lg border border-line bg-white py-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {(['PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED'] as ProjectStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updateProject.isPending}
                  className={`
                    flex w-full items-center px-3 py-2 text-left text-xs
                    transition-colors hover:bg-surface-container
                    ${project.status === status ? 'font-semibold text-primary' : 'text-ink'}
                  `}
                >
                  {PROJECT_STATUS_LABEL[status]}
                </button>
              ))}
            </div>
          )}
        </div>
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
