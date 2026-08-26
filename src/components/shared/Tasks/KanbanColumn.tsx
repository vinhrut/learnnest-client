import TaskCard from "./TaskCard";

interface Props {
  title: string;
  count: number;
  status: string;
}

const KanbanColumn = ({
  title,
  count,
  status,
}: Props) => {
  return (
    <div className="flex w-[340px] flex-shrink-0 flex-col rounded-xl border border-[#C3C6D6] bg-[#E9EDFF]">

      <div className="flex items-center justify-between border-b border-[#C3C6D6] p-4">

        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase">
          {title}

          <span className="rounded-full bg-[#D8E2FF] px-2 py-0.5">
            {count}
          </span>
        </h3>

        <button>
          <span className="material-symbols-outlined">
            more_horiz
          </span>
        </button>

      </div>

      <div className="flex flex-col gap-3 overflow-y-auto p-3">

        {/* Task data sẽ lấy từ API */}
        <TaskCard />

      </div>

    </div>
  );
};

export default KanbanColumn;