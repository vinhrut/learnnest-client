# Getting Started - LearnNest Client

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Setup

### 1. Environment Variables

Tạo file `.env` trong root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Backend Requirements

Backend API cần hỗ trợ các endpoints sau:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/refresh` | POST | Refresh tokens |
| `/api/auth/me` | GET | Get current user |
| `/api/auth/forgot-password` | POST | Forgot password |
| `/api/auth/reset-password/:token` | POST | Reset password |
| `/api/auth/change-password` | POST | Change password |
| `/api/users` | GET/POST | List/Create users |
| `/api/users/:id` | GET/PUT/DELETE | User CRUD |
| `/api/users/:id/lock` | POST | Lock user |
| `/api/users/:id/unlock` | POST | Unlock user |
| `/api/projects` | GET/POST | List/Create projects |
| `/api/projects/:id` | GET/PUT/DELETE | Project CRUD |
| `/api/projects/:id/members` | GET/POST | Project members |
| `/api/projects/:id/members/:userId` | DELETE | Remove member |
| `/api/projects/:id/available-users` | GET | Available users |

---

## Project Structure Overview

```
src/
├── api/                    # API functions
│   ├── auth.api.ts
│   ├── project.api.ts
│   └── users.api.ts
│
├── components/
│   ├── feature/            # Business logic components
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── project/
│   │   ├── task/
│   │   └── users/
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
│
├── hooks/                  # Custom React hooks
│   ├── auth/
│   ├── profile/
│   ├── projects/
│   ├── users/
│   ├── useAuth.ts
│   └── useDebouncedValue.ts
│
├── lib/                    # Utilities
│   ├── axios.ts
│   ├── cn.ts
│   ├── errors.ts
│   └── queryClient.ts
│
├── pages/                  # Route pages
│   ├── auth/
│   ├── ba/
│   ├── dev/
│   ├── error/
│   ├── leader/
│   └── users/
│
├── routes/                 # Routing
│   └── index.tsx
│
├── stores/                 # Zustand stores
│   └── auth.store.ts
│
├── types/                  # TypeScript types
│   ├── api.ts
│   ├── auth.ts
│   ├── project.ts
│   ├── task.ts
│   └── user.ts
│
└── main.tsx                # Entry point
```

---

## Adding a New Feature

### 1. Add API Functions

```typescript
// src/api/feature.api.ts
import { api } from '@/lib/axios';
import type { Paginated } from '@/types/api';

export const featureApi = {
  list: (params?: FeatureFilters) => 
    api.get<Paginated<Feature>>('/features', { params }),
  
  getById: (id: string) => 
    api.get<Feature>(`/features/${id}`),
  
  create: (payload: CreateFeatureRequest) => 
    api.post<Feature>('/features', payload),
  
  update: (id: string, payload: UpdateFeatureRequest) => 
    api.put<Feature>(`/features/${id}`, payload),
  
  delete: (id: string) => 
    api.delete(`/features/${id}`),
};
```

### 2. Add Types

```typescript
// src/types/feature.ts
export interface Feature {
  id: string;
  name: string;
  description: string;
  status: FeatureStatus;
  createdAt: string;
  updatedAt: string;
}

export enum FeatureStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface CreateFeatureRequest {
  name: string;
  description?: string;
}
```

### 3. Add React Query Hooks

```typescript
// src/hooks/feature/feature.queries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { featureApi } from '@/api/feature.api';
import type { Feature, CreateFeatureRequest, FeatureFilters } from '@/types/feature';

export const featureKeys = {
  all: ['features'] as const,
  list: (params: FeatureFilters) => ['features', 'list', params] as const,
  detail: (id: string) => ['features', 'detail', id] as const,
};

export function useFeatures(filters: FeatureFilters) {
  return useQuery({
    queryKey: featureKeys.list(filters),
    queryFn: () => featureApi.list(filters),
  });
}

export function useFeature(id: string) {
  return useQuery({
    queryKey: featureKeys.detail(id),
    queryFn: () => featureApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateFeatureRequest) => featureApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: featureKeys.all });
      toast.success('Feature created successfully');
    },
  });
}
```

### 4. Add UI Components

```typescript
// src/components/feature/feature/FeatureCard.tsx
import { Card, Badge } from '@/components/ui';
import type { Feature } from '@/types/feature';

interface FeatureCardProps {
  feature: Feature;
  onEdit?: (feature: Feature) => void;
}

export function FeatureCard({ feature, onEdit }: FeatureCardProps) {
  return (
    <Card>
      <h3>{feature.name}</h3>
      <p>{feature.description}</p>
      <Badge variant={feature.status === 'ACTIVE' ? 'success' : 'neutral'}>
        {feature.status}
      </Badge>
    </Card>
  );
}
```

### 5. Add Page

```typescript
// src/pages/feature/FeatureListPage.tsx
import { useState } from 'react';
import { PageHeader } from '@/components/layout';
import { Button, Table, Modal } from '@/components/ui';
import { useFeatures, useCreateFeature } from '@/hooks/feature';
import { FeatureForm } from '@/components/feature/feature';

export function FeatureListPage() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading } = useFeatures({ page, limit: 10 });
  const createMutation = useCreateFeature();
  
  return (
    <>
      <PageHeader 
        title="Features"
        action={<Button onClick={() => setIsModalOpen(true)}>+ Add Feature</Button>}
      />
      
      <Table
        dataSource={data?.data}
        loading={isLoading}
        columns={[...]}
        pagination={{
          current: page,
          pageSize: 10,
          total: data?.meta.total,
          onChange: setPage,
        }}
      />
      
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Feature"
      >
        <FeatureForm
          onSubmit={(values) => {
            createMutation.mutate(values);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </>
  );
}
```

### 6. Add Routes

```typescript
// src/routes/index.tsx
import { FeatureListPage } from '@/pages/feature';

// Trong route definitions
<Route path="/feature" element={<FeatureListPage />} />
```

---

## Authentication Flow

1. **Login**: Gọi `/api/auth/login`, lưu tokens vào Zustand store
2. **Token Attachment**: Axios interceptor tự động gắn Bearer token
3. **Auto-refresh**: Khi nhận 401, interceptor thử refresh token
4. **Logout**: Xóa tokens, chuyển về trang login

### Using Auth in Components

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return (
    <div>
      Welcome, {user?.fullName}!
      <Button onClick={logout}>Logout</Button>
    </div>
  );
}
```

---

## Common Patterns

### Loading States

```typescript
// Using React Query
const { data, isLoading, error } = useSomeQuery();

// In component
if (isLoading) return <PageLoading />;
if (error) return <ErrorState error={error} />;
return <DataList data={data} />;
```

### Form Submission

```typescript
const mutation = useCreateItem();

const handleSubmit = (values: FormValues) => {
  mutation.mutate(values, {
    onSuccess: () => {
      toast.success('Created successfully');
      onClose();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
```

### Pagination

```typescript
const [page, setPage] = useState(1);

const { data } = useItems({ page, limit: 10 });

// Update page
<Button onClick={() => setPage(p => p + 1)}>Next</Button>
<Button onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
```

---

## Troubleshooting

### "Module not found" errors
- Kiểm tra path alias trong `vite.config.ts`
- Đảm bảo file tồn tại và export đúng

### "Cannot read property of undefined"
- Kiểm tra optional chaining `?.` khi truy cập nested properties
- Kiểm tra initial state của hooks

### API calls not going
- Kiểm tra `VITE_API_BASE_URL` trong `.env`
- Kiểm tra network tab trong DevTools
- Verify backend đang chạy

### Auth issues
- Clear localStorage/sessionStorage
- Check token expiration settings
- Verify backend refresh endpoint hoạt động
