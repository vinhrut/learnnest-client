interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  deadline: string;
}

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const isClosed = project.status === "Đã đóng";

  return (
    <div
      className={`
        relative flex h-full flex-col overflow-hidden
        rounded-xl border border-[#C3C6D6]
        bg-white p-5
        transition-all duration-200
        hover:shadow-[0_4px_8px_rgba(9,30,66,0.08)]
        ${isClosed ? "opacity-70 grayscale-[30%]" : ""}
      `}
    >
      {/* Top status line */}
      {!isClosed && (
        <div
          className={`absolute left-0 top-0 h-1 w-full ${
            project.id === 1
              ? "bg-green-500"
              : "bg-amber-500"
          }`}
        />
      )}

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="pr-8 text-xl font-semibold text-[#051A3E]">
          {project.title}
        </h3>

        <span
          className={`
            absolute right-5 top-5
            inline-flex items-center
            rounded px-2 py-1
            text-[10px] font-semibold uppercase
            ${
              isClosed
                ? "bg-[#E9EDFF] text-[#434654]"
                : "bg-[#E3FCEF] text-[#006644]"
            }
          `}
        >
          {project.status}
        </span>
      </div>

      {/* Description */}
      <p className="mb-6 line-clamp-2 flex-grow text-sm text-[#434654]">
        {project.description}
      </p>

      {/* Progress */}
      <div className="mb-4">

        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold text-[#434654]">
            Tiến độ
          </span>

          <span
            className={`text-xs font-semibold ${
              isClosed
                ? "text-[#434654]"
                : "text-[#003D9B]"
            }`}
          >
            {project.progress}%
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-[#E1E8FF]">
          <div
            className={`
              h-2 rounded-full
              ${
                isClosed
                  ? "bg-[#434654]"
                  : project.id === 1
                    ? "bg-[#0052CC]"
                    : "bg-amber-500"
              }
            `}
            style={{
              width: `${project.progress}%`,
            }}
          />
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-[#C3C6D6] pt-4">

        {/* Members */}
        <div className="flex -space-x-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#D8E2FF] text-xs font-semibold">
            A
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#D8E2FF] text-xs font-semibold">
            B
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#E9EDFF] text-[10px]">
            +2
          </div>

        </div>

        {/* Deadline */}
        <div className="flex items-center gap-1 text-[#434654]">

          <span className="material-symbols-outlined text-[16px]">
            {isClosed ? "check_circle" : "calendar_today"}
          </span>

          <span className="text-[11px] font-semibold">
            {project.deadline}
          </span>

        </div>

      </div>
    </div>
  );
};

export default ProjectCard;