# LearnNest Client - Documentation

## 1. Project Overview

**Project Name:** LearnNest Client  
**Type:** React SPA (Single Page Application)  
**Build Tool:** Vite  
**Language:** TypeScript + JSX  
**Styling:** Tailwind CSS v4  

Một hệ thống quản lý task và dự án với phân quyền người dùng theo vai trò.

---

## 2. Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| Framework | React | 19.2.8 |
| Router | React Router DOM | 7.18.2 |
| Build Tool | Vite | 8.2.2 |
| Styling | Tailwind CSS | 4.3.3 |
| State Management | Zustand | 5.0.15 |
| Data Fetching | TanStack React Query | 5.102.6 |
| HTTP Client | Axios | 1.19.0 |
| UI Library | Ant Design | 6.6.1 |
| Icons | React Icons + React Icons Files | 5.7.0 / 4.1.0 |
| Drag & Drop | @dnd-kit | 0.5.0 |
| Language | TypeScript | ~6.0.2 |

---

## 3. Project Structure

```
src/
├── api/                    # API modules
├── assets/                 # Static assets
├── components/
│   ├── feature/            # Feature-specific components
│   │   ├── dashboard/     # Dashboard widgets
│   │   ├── profile/        # Profile components
│   │   ├── project/        # Project components
│   │   ├── task/           # Kanban board & task components
│   │   └── users/          # User management components
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
│       └── toast/          # Toast notification system
├── config/                 # Configuration
├── constants/              # Constants
├── hooks/                  # Custom React hooks
│   ├── auth/               # Auth-related hooks
│   ├── profile/            # Profile hooks
│   ├── projects/           # Project hooks
│   └── users/              # User hooks
├── lib/                    # Utility libraries
├── pages/                  # Route pages
│   ├── auth/               # Authentication pages
│   ├── ba/                 # BA pages
│   ├── dev/                # Developer pages
│   ├── error/              # Error pages
│   ├── leader/             # Leader pages
│   ├── task/               # Task page
│   └── users/              # User management page
├── routes/                 # Routing configuration
├── stores/                 # Zustand state stores
├── types/                  # TypeScript type definitions
├── App.tsx
├── Root.tsx                # App root with bootstrap auth
├── index.css               # Global styles
└── main.tsx                # Entry point
```

---

## 4. API Layer (`src/api/`)

### `auth.api.ts`
- `login(payload)` - Đăng nhập
- `logout()` - Đăng xuất
- `refreshToken(refreshToken)` - Làm mới token
- `forgotPassword(email)` - Quên mật khẩu
- `resetPassword(token, payload)` - Đặt lại mật khẩu
- `changePassword(payload)` - Đổi mật khẩu
- `getCurrentUser()` - Lấy thông tin user hiện tại

### `project.api.ts`
- `list(params)` - Danh sách projects (phân trang)
- `getById(id)` - Chi tiết project
- `create(payload)` - Tạo project mới
- `update(id, payload)` - Cập nhật project
- `delete(id)` - Xóa project
- `getMembers(projectId)` - Lấy danh sách thành viên
- `addMember(projectId, payload)` - Thêm thành viên
- `removeMember(projectId, userId)` - Xóa thành viên
- `getAvailableUsers(projectId)` - Users khả dụng để thêm

### `users.api.ts`
- `list(params)` - Danh sách users (phân trang)
- `getById(id)` - Chi tiết user
- `create(payload)` - Tạo user mới
- `update(id, payload)` - Cập nhật user
- `delete(id)` - Xóa user
- `lock(id)` - Khóa tài khoản
- `unlock(id)` - Mở khóa tài khoản

---

## 5. Authentication & Authorization

### Auth Flow
1. User đăng nhập tại `/login`
2. Server trả về `accessToken` + `refreshToken` + `user`
3. Tokens được lưu trong Zustand (persisted to localStorage/sessionStorage)
4. Axios interceptor tự động gắn `Bearer` token vào mọi request
5. Khi nhận 401 response, interceptor thử refresh token
6. Nếu refresh thất bại, user bị đăng xuất và chuyển về login

### Roles (RoleCode)
| Code | Name | Permissions |
|------|------|-------------|
| `ADMIN` | Administrator | Toàn quyền truy cập |
| `LEAD` | Leader | Quản lý project + user |
| `BA` | Business Analyst | Truy cập project giới hạn |
| `USER` | Developer | Chỉ xem task của mình |

---

## 6. State Management

### Zustand Stores (`src/stores/`)
| Store | Purpose |
|-------|---------|
| `authStore` | Auth state (tokens, user, status), session management |

### React Query
- Tất cả server state được quản lý qua React Query
- Query keys theo pattern: `['resource', 'action', params]`
- Stale time: 30s default
- Auto retry cho server errors (max 2 retries)
- Global error handling qua QueryCache

---

## 7. Routing Structure

```
/                           → redirect /leader/dashboard
├── /login                  [GuestRoute] → AuthLayout
├── /forgot-password        [GuestRoute] → AuthLayout
│
├── /leader/*               [RoleRoute: LEAD] → AppLayout
│   ├── /leader/dashboard   - Dashboard với stats
│   ├── /leader/projects    - Danh sách projects
│   ├── /leader/projects/:id - Chi tiết project + members
│   ├── /leader/tasks        - Kanban board
│   ├── /leader/users        - CRUD users
│   └── /leader/profile      - Quản lý profile
│
├── /ba/*                   [RoleRoute: BA] → AppLayout
│   ├── /ba/dashboard
│   ├── /ba/projects
│   └── /ba/profile
│
├── /dev/*                  [RoleRoute: USER] → AppLayout
│   ├── /dev/dashboard
│   ├── /dev/projects
│   └── /dev/profile
│
└── *                       → NotFound
```

### Route Guards
| Guard | Purpose |
|-------|---------|
| `GuestRoute` | Chỉ cho phép guest (chưa đăng nhập) |
| `ProtectedRoute` | Yêu cầu đăng nhập |
| `RoleRoute` | Kiểm tra quyền theo role |

---

## 8. Components

### Layout Components (`src/components/layout/`)

| Component | Purpose |
|-----------|---------|
| `AppLayout` | Main layout với sidebar + topbar + Outlet |
| `AuthLayout` | 2-column layout (brand trái, form phải) |
| `Sidebar` | Navigation sidebar theo role, mobile drawer |
| `Topbar` | Header với user menu dropdown, logout |
| `PageHeader` | Page title + subtitle + action buttons |

### UI Components (`src/components/ui/`)

| Component | Purpose |
|-----------|---------|
| `Avatar` | User avatar với fallback initials |
| `Badge` | Status/tone badge |
| `Button` | Button với variants (primary, secondary, danger, ghost) |
| `Card` | Container card với optional header |
| `Checkbox` | Custom checkbox |
| `ConfirmDialog` | Modal xác nhận |
| `Drawer` | Slide-in drawer panel |
| `EmptyState` | Placeholder cho trạng thái empty |
| `IconButton` | Icon-only button |
| `Input` | Text input với label, error, icons |
| `Modal` | Modal dialog với portal |
| `MultiSelect` | Multi-select dropdown |
| `PageLoading` | Full-page loading spinner |
| `Pagination` | Pagination controls |
| `PasswordInput` | Password input với show/hide toggle |
| `ProgressBar` | Progress indicator |
| `Select` | Dropdown select |
| `Spinner` | Loading spinner |
| `Table` | Generic data table với columns config |
| `Tabs` | Tab navigation |
| `Toaster` | Toast notification display |
| `AvatarGroup` | Nhóm avatar |

### Feature Components (`src/components/feature/`)

#### Dashboard
| Component | Purpose |
|-----------|---------|
| `AlertItem` | Single alert cho due tasks |
| `AlertList` | Danh sách tasks due trong 24h |
| `RecentUsersCard` | Widget users gần đây |
| `StatCard` | Statistics card với icon |
| `StatusBreakdown` | Biểu đồ user status breakdown |

#### Profile
| Component | Purpose |
|-----------|---------|
| `ChangePasswordModal` | Form đổi mật khẩu modal |
| `ProfileForm` | Profile edit form |
| `ProfileInfoCard` | Read-only profile display |

#### Project
| Component | Purpose |
|-----------|---------|
| `AddMemberModal` | Modal thêm member vào project |
| `CreateProjectModal` | Form tạo project mới |
| `ProjectCard` | Project display card |

#### Task
| Component | Purpose |
|-----------|---------|
| `KanbanBoard` | Kanban board container |
| `KanbanColumn` | Single Kanban column |
| `TaskCard` | Task card cho Kanban |
| `TaskDetailDrawer` | Task detail side panel |
| `TaskPriorityBadge` | Priority badge |
| `TaskStatusBadge` | Status badge |

#### Users
| Component | Purpose |
|-----------|---------|
| `RoleTags` | Role badges display |
| `UserDetailModal` | User detail view modal |
| `UserFilters` | Search + filter controls |
| `UserFormModal` | Create/edit user form |
| `UserRowActions` | Action buttons per row |
| `UserStatusBadge` | Status badge cho users |
| `UserTable` | User data table |

---

## 9. Hooks (`src/hooks/`)

| Hook | Purpose |
|------|---------|
| `useAuth` | Auth state access + bootstrap on app start |
| `useDebouncedValue` | Debounce cho search inputs |
| `useUsers` | User queries (CRUD, lock/unlock) |
| `useProjects` | Project queries (CRUD, members) |
| `useProfile` | Profile fetch + update |
| `useLogin` | Login mutation |
| `useLogout` | Logout mutation |
| `useChangePassword` | Change password mutation |

---

## 10. Types (`src/types/`)

### `auth.ts`
```typescript
LoginRequest, LoginResponse, AuthUser, 
ForgotPasswordRequest, ChangePasswordRequest
```

### `user.ts`
```typescript
User, RoleCode, UserStatus, 
ROLE_CODES, ROLE_LABEL, 
CreateUserRequest, UpdateUserRequest, UserFilters
```

### `project.ts`
```typescript
Project, ProjectMember, ProjectMemberRole, 
CreateProjectRequest, UpdateProjectRequest, 
PROJECT_STATUS
```

### `task.ts`
```typescript
Task, TaskStatus, TaskPriority, SubTask, Comment, 
STATUS_CONFIG, PRIORITY_CONFIG
```

### `api.ts`
```typescript
PaginationMeta, Paginated<T>, ApiError, ApiErrorBody
```

---

## 11. Key Patterns

### API Pattern
```typescript
// api/user.api.ts
export const usersApi = {
  list: (query) => api.get<Paginated<User>>('/users', { params: query }),
  getById: (id) => api.get<User>(`/users/${id}`),
  create: (payload) => api.post<User>('/users', payload),
};
```

### React Query Hook Pattern
```typescript
export const userKeys = {
  all: ['users'] as const,
  list: (params) => ['users', 'list', params] as const,
};

export function useUsersQuery(params) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => usersApi.list(params),
  });
}
```

### Toast Notifications
```typescript
// Global toast store via Zustand
toast.success('Thành công!');
toast.error('Có lỗi xảy ra');
toast.warning('Cảnh báo');
toast.info('Thông tin');
// Auto-dismiss after 4 seconds
```

---

## 12. Environment Configuration

### Required `.env`
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 13. Available Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

---

## 14. Development Guidelines

### Code Style
- Sử dụng TypeScript strict mode
- Functional components với hooks
- Component names: PascalCase
- File names: PascalCase for components, camelCase for others
- Import order: React → libs → components → types → utils

### Component Structure
```typescript
// Feature component
src/components/feature/{feature}/
├── ComponentName.tsx
└── index.ts (barrel export)

// UI component
src/components/ui/
├── ComponentName.tsx
└── index.ts (barrel export)
```

### State Management Priority
1. **Local state** - useState, useReducer
2. **Server state** - React Query
3. **Global UI state** - Zustand (authStore, toastStore)

---

---

## 16. Documentation Files

| File | Description |
|------|-------------|
| `CLAUDE.md` | Main documentation (this file) |
| `docs/API.md` | API endpoints documentation |
| `docs/COMPONENTS.md` | Components usage guide |
| `docs/HOOKS.md` | Hooks & utilities reference |
| `docs/GETTING_STARTED.md` | Quick start guide |

---

## 17. File Statistics

| Category | Count |
|----------|-------|
| Total TS/TSX files | 100+ |
| API modules | 3 |
| UI components | 25+ |
| Feature components | 25+ |
| Page components | 15 |
| Route definitions | 15+ |
| Custom hooks | 6 |
| Type definitions | 5 |
