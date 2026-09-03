import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/layout/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { useProjectsQuery } from '@/hooks/projects/project.queries';
import { ProjectCard } from '@/components/feature/project/ProjectCard';

export function BAProjectPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useProjectsQuery();

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
      />

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/ba/projects/${project.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-line">
          <p className="text-muted">Chưa có dự án nào.</p>
        </div>
      )}
    </div>
  );
}
