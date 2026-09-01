# API Documentation - LearnNest Client

## Base Configuration

**Base URL:** `http://localhost:3000` (from `VITE_API_BASE_URL`)

**Authentication:** Bearer Token (JWT)

---

## Authentication API (`/api/auth`)

### Login
```typescript
POST /api/auth/login
Body: { email: string, password: string }
Response: {
  accessToken: string,
  refreshToken: string,
  user: AuthUser
}
```

### Logout
```typescript
POST /api/auth/logout
Headers: Authorization: Bearer <token>
Response: { success: boolean }
```

### Refresh Token
```typescript
POST /api/auth/refresh
Body: { refreshToken: string }
Response: {
  accessToken: string,
  refreshToken: string
}
```

### Forgot Password
```typescript
POST /api/auth/forgot-password
Body: { email: string }
Response: { message: string }
```

### Reset Password
```typescript
POST /api/auth/reset-password/:token
Body: { password: string }
Response: { message: string }
```

### Change Password
```typescript
POST /api/auth/change-password
Headers: Authorization: Bearer <token>
Body: { currentPassword: string, newPassword: string }
Response: { message: string }
```

### Get Current User
```typescript
GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: AuthUser
```

---

## Users API (`/api/users`)

### List Users
```typescript
GET /api/users
Query: {
  page?: number,
  limit?: number,
  search?: string,
  role?: RoleCode,
  status?: UserStatus
}
Response: Paginated<User>
```

### Get User By ID
```typescript
GET /api/users/:id
Response: User
```

### Create User
```typescript
POST /api/users
Body: {
  email: string,
  password: string,
  fullName: string,
  role: RoleCode
}
Response: User
```

### Update User
```typescript
PUT /api/users/:id
Body: Partial<{
  email: string,
  fullName: string,
  role: RoleCode,
  status: UserStatus
}>
Response: User
```

### Delete User
```typescript
DELETE /api/users/:id
Response: { success: boolean }
```

### Lock User
```typescript
POST /api/users/:id/lock
Response: { success: boolean }
```

### Unlock User
```typescript
POST /api/users/:id/unlock
Response: { success: boolean }
```

---

## Projects API (`/api/projects`)

### List Projects
```typescript
GET /api/projects
Query: {
  page?: number,
  limit?: number,
  search?: string,
  status?: PROJECT_STATUS
}
Response: Paginated<Project>
```

### Get Project By ID
```typescript
GET /api/projects/:id
Response: Project
```

### Create Project
```typescript
POST /api/projects
Body: {
  name: string,
  description?: string,
  status?: PROJECT_STATUS
}
Response: Project
```

### Update Project
```typescript
PUT /api/projects/:id
Body: Partial<{
  name: string,
  description: string,
  status: PROJECT_STATUS
}>
Response: Project
```

### Delete Project
```typescript
DELETE /api/projects/:id
Response: { success: boolean }
```

### Get Project Members
```typescript
GET /api/projects/:id/members
Response: ProjectMember[]
```

### Add Project Member
```typescript
POST /api/projects/:id/members
Body: {
  userId: string,
  role: ProjectMemberRole
}
Response: ProjectMember
```

### Remove Project Member
```typescript
DELETE /api/projects/:id/members/:userId
Response: { success: boolean }
```

### Get Available Users for Project
```typescript
GET /api/projects/:id/available-users
Response: User[]
```

---

## Common Types

### Pagination
```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
```

### User
```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  role: RoleCode;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

enum RoleCode {
  ADMIN = 'ADMIN',
  LEAD = 'LEAD',
  BA = 'BA',
  USER = 'USER'
}

enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED'
}
```

### Project
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: PROJECT_STATUS;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectMemberRole;
  user: User;
  joinedAt: string;
}

enum PROJECT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  COMPLETED = 'COMPLETED'
}

enum ProjectMemberRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER'
}
```

---

## Error Handling

All API errors follow this format:
```typescript
interface ApiError {
  statusCode: number;
  message: string;
  errors?: Record<string, string[]>;
}
```

### Common Error Codes
| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/expired token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |
