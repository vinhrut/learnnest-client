import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiTrash2 } from 'react-icons/fi';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Avatar } from '@/components/ui/Avatar';
import { useProjectQuery, useProjectMembersQuery, useRemoveProjectMember } from '@/hooks/projects/project.queries';
import { useAuth } from '@/hooks/useAuth';
import { PROJECT_STATUS_LABEL, PROJECT_STATUS_COLOR } from '@/types/project';
import { AddMemberModal } from '@/components/feature/project/AddMemberModal';

export function LeaderProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: project, isLoading: projectLoading } = useProjectQuery(id);
  const { data: members, isLoading: membersLoading } = useProjectMembersQuery(id);
  const removeMember = useRemoveProjectMember();

  const [showAddMember, setShowAddMember] = useState(false);
  const [removeConfirm, setRemoveConfirm] = useState<{ userId: string; name: string } | null>(null);

  const isOwner = user && project && user.id === project.owner_id;

  if (projectLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <p className="text-muted">Không tìm thấy dự án</p>
        <Button variant="secondary" onClick={() => navigate('/leader/projects')}>
          <FiArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  const handleRemoveMember = async () => {
    if (!removeConfirm || !id) return;
    try {
      await removeMember.mutateAsync({ projectId: id, userId: removeConfirm.userId });
      setRemoveConfirm(null);
    } catch {
      // Error handled by query
    }
  };

  return (
    <div>
      <PageHeader
        title={project.name}
        subtitle={`Mã dự án: ${project.code}`}
        actions={
          <Button variant="secondary" onClick={() => navigate('/leader/projects')}>
            <FiArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        }
      />

      {/* Project Info */}
      <div className="mb-6 rounded-xl border border-line bg-white p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Trạng thái</p>
            <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-semibold ${PROJECT_STATUS_COLOR[project.status]}`}>
              {PROJECT_STATUS_LABEL[project.status]}
            </span>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Mã dự án</p>
            <p className="text-sm font-medium text-ink">{project.code}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Ngày tạo</p>
            <p className="text-sm text-ink">
              {new Date(project.created_at).toLocaleDateString('vi-VN')}
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Chủ sở hữu</p>
            <p className="text-sm font-medium text-ink">
              {members?.find((m) => m.project_role === 'OWNER')?.user.full_name || '-'}
            </p>
          </div>
        </div>

        {project.description && (
          <div className="mt-4 border-t border-line pt-4">
            <p className="mb-1 text-xs font-medium text-muted">Mô tả</p>
            <p className="text-sm text-ink">{project.description}</p>
          </div>
        )}
      </div>

      {/* Members Section */}
      <div className="rounded-xl border border-line bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Thành viên</h2>
          {isOwner && (
            <Button size="sm" onClick={() => setShowAddMember(true)}>
              <FiPlus className="h-4 w-4" />
              Thêm thành viên
            </Button>
          )}
        </div>

        {membersLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Spinner />
          </div>
        ) : members && members.length > 0 ? (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between rounded-lg border border-line p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={member.user.avatar_url}
                    name={member.user.full_name || member.user.username}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {member.user.full_name || member.user.username}
                      {member.project_role === 'OWNER' && (
                        <span className="ml-2 text-xs text-primary">(Chủ sở hữu)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-canvas px-2 py-0.5 text-xs font-medium text-muted">
                    {member.project_role}
                  </span>
                  {isOwner && member.project_role !== 'OWNER' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setRemoveConfirm({
                          userId: member.user_id,
                          name: member.user.full_name || member.user.username,
                        })
                      }
                      className="text-danger hover:bg-danger/10"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">Chưa có thành viên nào</p>
        )}
      </div>

      {id && (
        <AddMemberModal
          projectId={id}
          open={showAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}

      <ConfirmDialog
        open={!!removeConfirm}
        onClose={() => setRemoveConfirm(null)}
        onConfirm={handleRemoveMember}
        title="Xóa thành viên"
        description={`Bạn có chắc muốn xóa "${removeConfirm?.name}" khỏi dự án?`}
        confirmLabel="Xóa"
        danger
        loading={removeMember.isPending}
      />
    </div>
  );
}
