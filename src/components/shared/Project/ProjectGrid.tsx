import ProjectCard from "../../common/ProjectCard";

const projects = [
  {
    id: 1,
    title: "Nâng cấp Hệ thống CRM Khách hàng",
    description:
      "Triển khai module AI để phân tích hành vi người dùng và tối ưu hóa quy trình bán hàng.",
    status: "RUNNING",
    progress: 75,
    deadline: "15 Thg 10",
  },
  {
    id: 2,
    title: "Thiết kế lại Giao diện Người dùng Mobile",
    description:
      "Áp dụng ngôn ngữ thiết kế mới cho ứng dụng di động để tăng trải nghiệm người dùng.",
    status: "RUNNING",
    progress: 30,
    deadline: "30 Thg 11",
  },
  {
    id: 3,
    title: "Tích hợp Cổng thanh toán Quốc tế",
    description:
      "Thêm hỗ trợ cho Stripe và PayPal vào hệ thống checkout hiện tại.",
    status: "CLOSED",
    progress: 100,
    deadline: "Hoàn thành",
  },
];

const ProjectGrid = () => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
};

export default ProjectGrid;