const ManagerUserHeader = ({
  onInvite,
}: {
  onInvite: () => void;
}) => {
  return (
    <div className="flex items-end justify-between border-b border-[#C3C6D6] pb-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#051A3E]">
          User Management
        </h1>

        <p className="mt-1 text-sm text-[#434654]">
          Quản lý tài khoản và quyền truy cập của nhân viên trong hệ thống.
        </p>
      </div>

      <button
        onClick={onInvite}
        className="flex items-center gap-2 rounded-lg bg-[#0052CC] px-4 py-2 text-sm font-semibold text-white hover:bg-[#003D9B]"
      >
        <span className="material-symbols-outlined text-[18px]">
          person_add
        </span>

        Mời nhân viên
      </button>
    </div>
  );
};

export default ManagerUserHeader;