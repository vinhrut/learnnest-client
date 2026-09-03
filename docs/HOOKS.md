# Hooks & Utilities Documentation - LearnNest Client

## Custom Hooks

### useAuth
Truy cập auth state và bootstrap application.

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { 
    user,           // AuthUser | null
    isAuthenticated, // boolean
    isLoading,       // boolean
    login,           // (credentials) => Promise
    logout,          // () => Promise
    changePassword   // (payload) => Promise
  } = useAuth();
  
  // ...
}
```

**Auth Store State:**
```typescript
interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
  
  // Actions
  setAuth: (user, accessToken, refreshToken) => void;
  setUser: (user) => void;
  clearAuth: () => void;
  bootstrap: () => Promise<void>; // Fetch user from /me endpoint
}
```

---

### useDebouncedValue
Debounce giá trị để tránh gọi API quá nhiều.

```typescript
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

function SearchComponent() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 500);
  
  // debouncedQuery chỉ thay đổi sau 500ms không nhập
  useEffect(() => {
    if (debouncedQuery) {
      searchAPI(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return <Input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

---

### useUsers
Hooks cho user management với React Query.

```typescript
import { useUsers, useUser, useCreateUser, useUpdateUser, useDeleteUser, useLockUser, useUnlockUser } from '@/hooks/users';

// List users với pagination
function UsersPage() {
  const { data, isLoading, error } = useUsers({
    page: 1,
    limit: 10,
    search: 'john',
    role: 'USER'
  });
  
  if (isLoading) return <Loading />;
  if (error) return <Error error={error} />;
  
  return <UserTable users={data?.data} pagination={data?.meta} />;
}

// Get single user
function UserDetail({ userId }) {
  const { data: user, isLoading } = useUser(userId);
  return <div>{user?.fullName}</div>;
}

// Create user
function CreateUserForm() {
  const createMutation = useCreateUser();
  
  const handleSubmit = (values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success('User created');
        navigate('/users');
      }
    });
  };
}
```

**Available Hooks:**
| Hook | Purpose |
|------|---------|
| `useUsers(filters)` | List users với filters |
| `useUser(id)` | Get single user |
| `useCreateUser()` | Create new user |
| `useUpdateUser()` | Update user |
| `useDeleteUser()` | Delete user |
| `useLockUser()` | Lock user account |
| `useUnlockUser()` | Unlock user account |

---

### useProjects
Hooks cho project management.

```typescript
import { 
  useProjects, 
  useProject, 
  useProjectMembers,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useAddMember,
  useRemoveMember
} from '@/hooks/projects';

// List projects
function ProjectsPage() {
  const { data, isLoading } = useProjects({ status: 'ACTIVE' });
  return <ProjectList projects={data?.data} />;
}

// Get project detail with members
function ProjectDetail({ projectId }) {
  const { data: project } = useProject(projectId);
  const { data: members } = useProjectMembers(projectId);
  
  return (
    <div>
      <h1>{project?.name}</h1>
      <MemberList members={members} />
    </div>
  );
}

// Add member to project
function AddMemberButton({ projectId }) {
  const addMember = useAddMember();
  
  const handleAdd = (userId) => {
    addMember.mutate({ projectId, userId, role: 'MEMBER' });
  };
}
```

**Available Hooks:**
| Hook | Purpose |
|------|---------|
| `useProjects(filters)` | List projects |
| `useProject(id)` | Get project detail |
| `useProjectMembers(projectId)` | Get project members |
| `useAvailableUsers(projectId)` | Users available to add |
| `useCreateProject()` | Create project |
| `useUpdateProject()` | Update project |
| `useDeleteProject()` | Delete project |
| `useAddMember()` | Add member to project |
| `useRemoveMember()` | Remove member from project |

---

### useProfile
Profile management hooks.

```typescript
import { useProfile, useUpdateProfile, useChangePassword } from '@/hooks/profile';

function ProfilePage() {
  const { data: profile, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const passwordMutation = useChangePassword();
  
  const handleUpdate = (values) => {
    updateMutation.mutate(values, {
      onSuccess: () => toast.success('Profile updated')
    });
  };
  
  const handleChangePassword = (values) => {
    passwordMutation.mutate(values, {
      onSuccess: () => {
        toast.success('Password changed');
        closeModal();
      }
    });
  };
}
```

---

## Utility Functions

### `lib/cn.ts` - Class Name Merger
Wrapper cho `clsx` với `tailwind-merge`.

```typescript
import { cn } from '@/lib/cn';

// Merge class names
cn('px-4', 'py-2', condition && 'bg-blue-500', 'text-white');
// → 'px-4 py-2 bg-blue-500 text-white' (if condition is true)
```

---

### `lib/axios.ts` - Axios Instance
Pre-configured Axios instance với interceptors.

```typescript
import { api } from '@/lib/axios';

// Already configured with:
// - Base URL from VITE_API_BASE_URL
// - Request interceptor (attach token)
// - Response interceptor (handle errors, auto-refresh token)

// Usage
api.get('/users');
api.post('/users', payload);
api.put('/users/1', payload);
api.delete('/users/1');
```

**Features:**
- Automatic Bearer token attachment
- Token refresh on 401
- Error normalization
- Type-safe responses

---

### `lib/queryClient.ts` - React Query Client
Pre-configured TanStack Query client.

```typescript
import { queryClient } from '@/lib/queryClient';

// Query client đã configured với:
// - Default staleTime: 30s
// - Retry: 2 lần cho errors
// - Global error handling

// Usage
await queryClient.invalidateQueries({ queryKey: ['users'] });
```

---

### `lib/errors.ts` - Error Handling
Extract error messages từ API responses.

```typescript
import { getErrorMessage, getApiError } from '@/lib/errors';

// Get error message từ various error types
const message = getErrorMessage(error);
// → "Email already exists" | "Network error" | etc.

// Get full API error object
const apiError = getApiError(error);
// → { statusCode: 400, message: "...", errors: {...} }
```

---

## Toast Store

```typescript
import { toastStore } from '@/components/ui/toast/toast.store';

// Toast state
toastStore.getState();
// → { toasts: [...], addToast: fn, removeToast: fn, clearToasts: fn }

// Helper functions được export riêng
import { toast } from '@/components/ui/toast/toast.store';

toast.success('Success message');
toast.error('Error message');
toast.warning('Warning message');
toast.info('Info message');
toast.loading('Loading...'); // Returns toast id

// Dismiss
toast.dismiss(toastId);
toast.clear(); // Dismiss all
```

**Toast Types:**
```typescript
interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  message: string;
  duration: number; // default 4000ms
}
```
