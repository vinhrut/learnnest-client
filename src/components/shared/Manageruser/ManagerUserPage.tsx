import ManagerUserHeader from "./ManagerUserHeader";
import UserFilters from "./components/UserFilters";
import UserTable from "./UserTable";
import InviteUserModal from "./components/InviteUserModal";

const ManagerUserPage = () => {
  return (
    <div className="space-y-6">

      <ManagerUserHeader />

      <UserFilters />

      <UserTable />

      <InviteUserModal />

    </div>
  );
};

export default ManagerUserPage;