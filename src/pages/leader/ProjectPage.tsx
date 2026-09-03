import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useProjectsQuery } from '@/hooks/projects/project.queries';
import { useAuth } from '@/hooks/useAuth';
import { ProjectCard } from '@/components/feature/project/ProjectCard';
import { CreateProjectModal } from '@/components/feature/project/CreateProjectModal';

export function LeaderProjectPage() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const { data: projects, isLoading, error } = useProjectsQuery();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const canCreateProject = hasRole('LEAD');

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-muted">
        Không thể tải danh sách dự án
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dự án"
        subtitle="Quản lý và theo dõi tiến độ các dự án hiện tại."
        actions={
          canCreateProject ? (
            <Button onClick={() => setShowCreateModal(true)}>
              <FiPlus className="h-4 w-4" />
              Tạo dự án mới
            </Button>
          ) : undefined
        }
      />

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/leader/projects/${project.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-line">
          <p className="text-muted">
            Chưa có dự án nào. {canCreateProject && 'Hãy tạo dự án đầu tiên!'}
          </p>
        </div>
      )}

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}
