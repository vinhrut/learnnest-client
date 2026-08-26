import DashboardHeader from "./DashboardHeader";
import KpiCards from "./KpiCard";
import TaskStatusChart from "./TaskStatusChart";
import WorkloadChart from "./WorkloadChart";
import DeadlineAlerts from "./DeadlineAlerts";

const DashboardPage = () => {
  return (
    <div className="space-y-6">

      <DashboardHeader />

      <KpiCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* Charts */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          <TaskStatusChart />
          <WorkloadChart />
        </div>

        {/* Deadline */}
        <div className="lg:col-span-4">
          <DeadlineAlerts />
        </div>

      </div>


    </div>
  );
};

export default DashboardPage;