const UserTable = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#C3C6D6] bg-white">

      <div className="overflow-x-auto">

        <table className="w-full text-left">

          <thead>
            <tr className="border-b bg-[#F1F3FF]">

              <th className="px-4 py-3">
                Avatar
              </th>

              <th className="px-4 py-3">
                Tên nhân viên
              </th>

              <th className="px-4 py-3">
                Email
              </th>

              <th className="px-4 py-3">
                Vai trò
              </th>

              <th className="px-4 py-3">
                Trạng thái
              </th>

              <th className="px-4 py-3 text-right">
                Thao tác
              </th>

            </tr>
          </thead>

          <tbody>
            {/* UserTableRow */}
          </tbody>

        </table>

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t p-4">
        <span className="text-sm text-[#434654]">
          Hiển thị 1-3 trong số 45 nhân viên
        </span>

        <div className="flex gap-2">
          <button>Trước</button>
          <button>Tiếp</button>
        </div>
      </div>

    </div>
  );
};

export default UserTable;