import TaskHeader from "./components/TaskHeader";
import TaskFilters from "./components/TaskFilters";
import KanbanBoard from "./components/KanbanBoard";

const TaskPage = () => {
  return (
    <div className="flex h-full flex-col">

      <TaskHeader />

      <TaskFilters />

      <KanbanBoard />

    </div>
  );
};

export default TaskPage;