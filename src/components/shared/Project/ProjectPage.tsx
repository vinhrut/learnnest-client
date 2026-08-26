import ProjectHeader from "./ProjectHeader";
import ProjectGrid from "./ProjectGrid";
import CreateProjectModal from "./CreateProjectModal";

const ProjectPage = () => {
  return (
    <div className="space-y-8">

      <ProjectHeader />

      <ProjectGrid />

      <CreateProjectModal />

    </div>
  );
};

export default ProjectPage;