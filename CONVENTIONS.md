# Quy ước `learnnest-client`

Frontend cho backend `learn_nestjs`. Stack: Vite + React 19 + TypeScript + Tailwind v4
+ react-router-dom 7 + **Zustand** (auth) + **TanStack Query** (server data) + axios.

## Cấu trúc thư mục

```
src/
  config/        Biến môi trường (env.ts).
  lib/           Hạ tầng dùng chung: axios (interceptor), queryClient, cn, errors.
  types/         Kiểu dữ liệu — khớp hợp đồng backend. Không chứa logic.
  api/           Hàm gọi HTTP thuần theo domain (auth.api.ts, users.api.ts).
  stores/        Zustand store — CHỈ auth/session.
  hooks/         Hook dùng chung + hooks/queries/ (TanStack Query theo domain).
  components/ui/ Component trình bày ("dumb"), không gọi API.
  components/layout/  Layout khung (AppLayout, AuthLayout, Sidebar, Topbar).
  routes/        Cây route + ProtectedRoute / GuestRoute.
  features/<tên>/  Code theo tính năng: trang + components/ riêng.
  pages/error/   Trang lỗi (404, 403).
```

## Nguyên tắc

1. **Server state đi qua `hooks/queries/`** — component không import `api/*` hay axios
   trực tiếp. Mutation luôn `invalidateQueries` key liên quan.
2. **Query key** tập trung trong mỗi file query (`userKeys`), dạng
   `['users', 'list', params]`, `['users', 'detail', id]`.
3. **Zustand chỉ giữ auth** (accessToken, refreshToken, user, status). Không nhét
   danh sách/entity server vào store.
4. **Lỗi API** được axios chuẩn hoá thành `ApiError { status, messages[] }`.
   Lỗi query hiển thị toast qua `QueryCache.onError` (global). Lỗi mutation xử lý
   tại chỗ bằng `onError` + `firstErrorMessage` / `guessFieldErrors`.
5. **Xác thực**: request interceptor gắn Bearer; response interceptor tự gọi
   `/auth/refresh` một lần khi gặp 401, thất bại thì xoá phiên + về `/login`.
   Khởi động app gọi `/auth/me` (`useBootstrapAuth`) để xác thực lại phiên đã lưu.
6. **Phân quyền**: `ProtectedRoute` + `requiredRoles`. Role lấy từ `user.roles`
   (`RoleCode = 'ADMIN' | 'BA' | 'USER'`), backend trả sẵn trong `/auth/login` và
   `/auth/me`.
7. **Style**: Tailwind + token màu trong `src/index.css` (`@theme`). Dùng class token
   (`bg-primary`, `text-ink`, `border-line`...), tránh hex rời rạc. Không dùng
   component của Ant Design.
8. **Reset state theo prop** dùng `key` để remount (vd `UserFormModal`), không dùng
   `useEffect` + `setState`.
9. **Đặt tên**: component `PascalCase.tsx`, hook `useXxx.ts`. Import nội bộ dùng alias
   `@/`.

## Chạy

```
# .env
VITE_API_BASE_URL=http://localhost:3000

npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run lint
```

Backend phải chạy ở cổng 3000 (CORS đã mở cho `localhost:5173`).
Tài khoản seed: `admin@gmail.com` / `12341234`.
