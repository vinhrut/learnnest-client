import KanbanColumn from "./KanbanColumn";

const KanbanBoard = () => {
  return (
    <div className="flex flex-1 gap-4 overflow-x-auto p-6">

      <KanbanColumn
        title="Cần làm"
        count={3}
        status="TODO"
      />

      <KanbanColumn
        title="Đang làm"
        count={2}
        status="IN_PROGRESS"
      />

      <KanbanColumn
        title="Đã xong"
        count={12}
        status="DONE"
      />

    </div>
  );
};

export default KanbanBoard;