# LearnNest Frontend - Kiến trúc và Documentation

## Mục lục
1. [Tổng quan](#1-tổng-quan)
2. [Cấu trúc Project](#2-cấu-trúc-project)
3. [Routing](#3-routing)
4. [State Management](#4-state-management)
5. [API Layer](#5-api-layer)
6. [Components](#6-components)
7. [Hooks](#7-hooks)
8. [Pages](#8-pages)
9. [Utils & Helpers](#9-utils--helpers)

---

## 1. Tổng quan

### Tech Stack

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
| Icons | React Icons | 5.7.0 |
| Drag & Drop | @dnd-kit | 0.5.0 |
| Language | TypeScript | ~6.0.2 |

### Project Structure

```
src/
├── api/                    # API modules (Axios + endpoints)
├── assets/                 # Static assets (images, fonts)
├── components/
│   ├── feature/           # Feature-specific components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── config/                 # Configuration files
├── constants/              # Constants (enums, configs)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility libraries
├── pages/                  # Route pages
├── routes/                 # Routing configuration
├── stores/                 # Zustand state stores
├── types/                  # TypeScript type definitions
├── App.tsx                 # Root component
├── Root.tsx               # Auth bootstrap
├── main.tsx               # Entry point
└── index.css             # Global styles
```

---

## 2. Cấu trúc Project

### API Layer (`src/api/`)

```typescript
// Pattern chuẩn cho API module
import { api } from '@/lib/axios';
import type { User, CreateUserRequest } from '@/types/user';

export const userApi = {
  // GET request với params
  getUsers: (params?: QueryParams) =>
    api.get<User[]>('/users', { params }).then(r => r.data),
  
  // POST request với body
  createUser: (payload: CreateUserRequest) =>
    api.post<User>('/users', payload).then(r => r.data),
  
  // PUT/PATCH request
  updateUser: (id: string, payload: Partial<CreateUserRequest>) =>
    api.patch<User>(`/users/${id}`, payload).then(r => r.data),
  
  // DELETE request
  deleteUser: (id: string) =>
    api.delete(`/users/${id}`).then(r => r.data),
};
```

### API Modules

| File | Description |
|------|-------------|
| `auth.api.ts` | Authentication endpoints |
| `users.api.ts` | User CRUD operations |
| `project.api.ts` | Project management |
| `task.api.ts` | Task operations (legacy) |
| `tasks.api.ts` | Task operations (v2) |
| `notifications.api.ts` | Notifications |

### Type Definitions (`src/types/`)

```typescript
// src/types/user.ts
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  status: UserStatus;
  roles: RoleCode[];
  created_at: string;
  updated_at: string;
}

export type RoleCode = 'ADMIN' | 'LEAD' | 'BA' | 'USER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED';

export const ROLE_LABELS: Record<RoleCode, string> = {
  ADMIN: 'Quản trị viên',
  LEAD: 'Trưởng nhóm',
  BA: 'Business Analyst',
  USER: 'Developer',
};
```

---

## 3. Routing

### Route Structure (`src/routes/`)

```typescript
// src/routes/AppRoutes.tsx
export function AppRoutes() {
  return (
    <Routes>
      {/* Guest routes - chỉ cho người chưa đăng nhập */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Leader routes */}
      <Route element={<RoleRoute allowedRoles={['LEAD']} />}>
        <Route element={<AppLayout />}>
          <Route path="/leader/dashboard" element={<LeaderDashboardPage />} />
          <Route path="/leader/projects" element={<ProjectPage />} />
          <Route path="/leader/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/leader/tasks" element={<TaskPage />} />
          <Route path="/leader/users" element={<UserPage />} />
          <Route path="/leader/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* BA routes */}
      <Route element={<RoleRoute allowedRoles={['BA']} />}>
        <Route element={<AppLayout />}>
          <Route path="/ba/dashboard" element={<BADashboardPage />} />
          <Route path="/ba/projects" element={<ProjectPage />} />
          <Route path="/ba/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Developer routes */}
      <Route element={<RoleRoute allowedRoles={['USER']} />}>
        <Route element={<AppLayout />}>
          <Route path="/dev/dashboard" element={<DevDashboardPage />} />
          <Route path="/dev/projects" element={<ProjectPage />} />
          <Route path="/dev/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin routes */}
      <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/users" element={<UserPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

### Route Guards

#### GuestRoute
Chỉ cho phép người dùng chưa đăng nhập truy cập.

```typescript
// src/routes/GuestRoute.tsx
export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}
```

#### ProtectedRoute
Yêu cầu đăng nhập.

```typescript
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoading />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
```

#### RoleRoute
Kiểm tra quyền theo role.

```typescript
// src/routes/RoleRoute.tsx
export function RoleRoute({ 
  allowedRoles, 
  children 
}: { 
  allowedRoles: string[]; 
  children: React.ReactNode; 
}) {
  const { user, hasRole, isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoading />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const hasAccess = allowedRoles.some(role => hasRole(role));
  
  if (!hasAccess) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}
```

---

## 4. State Management

### Zustand Stores (`src/stores/`)

#### Auth Store

```typescript
// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  roles: string[];
  status: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  
  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),
      
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      
      setUser: (user) => set({ user }),
      
      logout: () =>
        set({ 
          user: null, 
          accessToken: null, 
          refreshToken: null, 
          isAuthenticated: false 
        }),
    }),
    { name: 'auth-storage' }
  )
);

// Selector helpers
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasRole = (role: string) => user?.roles.includes(role) ?? false;
  
  return { user, isAuthenticated, hasRole };
};
```

#### Toast Store

```typescript
// src/stores/toastStore.ts
import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    
    // Auto remove after duration
    const duration = toast.duration ?? 4000;
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, duration);
  },
  
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Helper functions
export const toast = {
  success: (message: string, title?: string) =>
    useToastStore.getState().addToast({ type: 'success', message, title }),
  error: (message: string, title?: string) =>
    useToastStore.getState().addToast({ type: 'error', message, title }),
  warning: (message: string, title?: string) =>
    useToastStore.getState().addToast({ type: 'warning', message, title }),
  info: (message: string, title?: string) =>
    useToastStore.getState().addToast({ type: 'info', message, title }),
};
```

### React Query Pattern

```typescript
// src/hooks/users/user.queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/users.api';
import { toast } from '@/stores/toastStore';

// Query keys factory
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Query hooks
export function useUsersQuery(filters?: QueryParams) {
  return useQuery({
    queryKey: userKeys.list(filters ?? {}),
    queryFn: () => userApi.getUsers(filters),
    staleTime: 30_000, // 30 seconds
  });
}

export function useUserQuery(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  });
}

// Mutation hooks
export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('Tạo người dùng thành công');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userApi.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      toast.success('Cập nhật người dùng thành công');
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('Xóa người dùng thành công');
    },
  });
}
```

---

## 5. API Layer

### Axios Instance (`src/lib/axios.ts`)

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Thêm auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Xử lý 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Nếu là 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      
      if (refreshToken) {
        try {
          // Gọi API refresh
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Cập nhật tokens
          useAuthStore.getState().setTokens(accessToken, newRefreshToken);
          
          // Retry request với token mới
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh thất bại - logout
          useAuthStore.getState().logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

### API Module Example

```typescript
// src/api/project.api.ts
import { api } from '@/lib/axios';
import type { Project, ProjectMember, CreateProjectRequest } from '@/types/project';

export const projectApi = {
  getProjects: () =>
    api.get<Project[]>('/projects').then(r => r.data),

  getProject: (id: string) =>
    api.get<Project>(`/projects/${id}`).then(r => r.data),

  createProject: (payload: CreateProjectRequest) =>
    api.post<Project>('/projects', payload).then(r => r.data),

  updateProject: (id: string, payload: Partial<CreateProjectRequest>) =>
    api.patch<Project>(`/projects/${id}`, payload).then(r => r.data),

  deleteProject: (id: string) =>
    api.delete(`/projects/${id}`).then(r => r.data),

  getMembers: (projectId: string) =>
    api.get<ProjectMember[]>(`/projects/${projectId}/members`).then(r => r.data),

  addMember: (projectId: string, userId: string, role: string) =>
    api.post<ProjectMember>(`/projects/${projectId}/members`, {
      user_id: userId,
      project_role: role,
    }).then(r => r.data),

  removeMember: (projectId: string, userId: string) =>
    api.delete(`/projects/${projectId}/members/${userId}`).then(r => r.data),
};
```

---

## 6. Components

### Component Categories

#### Layout Components (`src/components/layout/`)

| Component | Description |
|-----------|-------------|
| `AppLayout` | Main layout với sidebar + topbar + Outlet |
| `AuthLayout` | 2-column layout (brand trái, form phải) |
| `Sidebar` | Navigation sidebar theo role |
| `Topbar` | Header với user menu, notifications, logout |
| `PageHeader` | Page title + subtitle + action buttons |

#### UI Components (`src/components/ui/`)

```typescript
// Reusable components pattern
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-md font-medium transition-colors focus:outline-none';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### Feature Components (`src/components/feature/`)

##### Task Components

```typescript
// src/components/feature/task/KanbanBoard.tsx
export function KanbanBoard({ projectId }: { projectId: string }) {
  const { data: tasks, isLoading } = useTasksQuery(projectId);
  
  const columns = [
    { id: 'DRAFT', title: 'Nháp', color: 'gray' },
    { id: 'WAITING_APPROVAL', title: 'Chờ duyệt', color: 'yellow' },
    { id: 'NEW', title: 'Mới', color: 'blue' },
    { id: 'DOING', title: 'Đang làm', color: 'purple' },
    { id: 'DONE', title: 'Hoàn thành', color: 'green' },
    { id: 'CLOSED', title: 'Đã đóng', color: 'gray' },
  ];
  
  if (isLoading) return <Skeleton />;
  
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            tasks={tasks?.filter(t => t.status === column.id) ?? []}
          />
        ))}
      </div>
    </DndContext>
  );
}
```

---

## 7. Hooks

### Custom Hooks Pattern

```typescript
// src/hooks/common/useDebouncedValue.ts
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  
  // Will only trigger API call after 300ms of no typing
  const { data } = useSearchQuery(debouncedQuery);
}
```

### Auth Hooks

```typescript
// src/hooks/auth/useAuth.ts
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasRole = (role: string) => user?.roles.includes(role) ?? false;
  
  return {
    user,
    isAuthenticated,
    hasRole,
  };
}

// src/hooks/auth/useLogin.ts
export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      useAuthStore.getState().setAuth(
        data.user,
        data.accessToken,
        data.refreshToken
      );
    },
  });
}

// src/hooks/auth/useLogout.ts
export function useLogout() {
  const { logout } = useAuthStore();
  
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      window.location.href = '/login';
    },
  });
}
```

---

## 8. Pages

### Page Component Pattern

```typescript
// src/pages/leader/ProjectPage.tsx
export function ProjectPage() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const { data: projects, isLoading } = useProjectsQuery();
  
  return (
    <div className="p-6">
      <PageHeader
        title="Dự án"
        subtitle="Quản lý các dự án của bạn"
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon className="w-5 h-5 mr-2" />
            Tạo dự án
          </Button>
        }
      />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : projects?.length === 0 ? (
        <EmptyState
          icon={FolderIcon}
          title="Chưa có dự án"
          description="Tạo dự án đầu tiên của bạn"
          action={
            <Button onClick={() => setIsCreateModalOpen(true)}>
              Tạo dự án
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => navigate(`/leader/projects/${project.id}`)}
            />
          ))}
        </div>
      )}
      
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
```

---

## 9. Utils & Helpers

### Date Formatting

```typescript
// src/lib/date.ts
import { format, formatDistanceToNow, isAfter, isBefore } from 'date-fns';
import { vi } from 'date-fns/locale';

export function formatDate(date: string | Date, formatStr = 'dd/MM/yyyy') {
  return format(new Date(date), formatStr, { locale: vi });
}

export function formatDateTime(date: string | Date) {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: vi });
}

export function formatRelative(date: string | Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
}

export function isOverdue(dueDate: string | Date) {
  return isBefore(new Date(dueDate), new Date());
}
```

### Role Helpers

```typescript
// src/lib/roles.ts
import type { RoleCode } from '@/types/user';

export const ROLE_CONFIG: Record<RoleCode, { label: string; color: string }> = {
  ADMIN: { label: 'Quản trị viên', color: 'red' },
  LEAD: { label: 'Trưởng nhóm', color: 'blue' },
  BA: { label: 'Business Analyst', color: 'green' },
  USER: { label: 'Developer', color: 'gray' },
};

export function canAccessProject(userRoles: RoleCode[], projectRole: string) {
  return userRoles.includes('ADMIN') || userRoles.includes('LEAD');
}

export function canCreateTask(userRoles: RoleCode[]) {
  return userRoles.includes('LEAD') || userRoles.includes('BA');
}

export function canAssignTask(userRoles: RoleCode[]) {
  return userRoles.includes('LEAD');
}
```

---

## 10. Best Practices

### Component Structure

```typescript
// ✅ Good: Tách biệt logic và UI
export function UserTable() {
  const { data, isLoading } = useUsersQuery();
  
  if (isLoading) return <Skeleton />;
  
  return (
    <Table
      columns={columns}
      data={data}
      onRowClick={(row) => navigate(`/users/${row.id}`)}
    />
  );
}

// ❌ Bad: Logic và UI lẫn lộn
export function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers().then(setUsers).finally(() => setLoading(false));
  }, []);
  
  return loading ? <Skeleton /> : <Table data={users} />;
}
```

### Error Handling

```typescript
// ✅ Good: Xử lý lỗi tập trung
export function useCreateUser() {
  return useMutation({
    mutationFn: userApi.createUser,
    onError: (error: ApiError) => {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    },
  });
}

// ❌ Bad: Không xử lý lỗi
export function useCreateUser() {
  return useMutation({
    mutationFn: userApi.createUser,
  });
}
```

### Type Safety

```typescript
// ✅ Good: Sử dụng typed response
const { data } = useQuery({
  queryKey: userKeys.detail(id),
  queryFn: () => userApi.getUser(id),
});

// data is typed as User | undefined
console.log(data?.email);

// ❌ Bad: Không có type
const { data } = useQuery({
  queryFn: () => axios.get('/users/' + id),
});

// data is typed as any
```
