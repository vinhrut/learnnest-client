# Components Documentation - LearnNest Client

## Layout Components

### AppLayout
Main application layout with sidebar navigation and topbar.

```typescript
// Usage
<AppLayout>
  <Outlet /> {/* Page content */}
</AppLayout>
```

**Features:**
- Responsive sidebar (collapsible on mobile)
- Role-based navigation menu
- Topbar with user menu and notifications
- Main content area with scroll

---

### AuthLayout
Two-column authentication layout.

```typescript
// Usage
<AuthLayout>
  <LoginForm />
</AuthLayout>
```

**Features:**
- Left column: Brand illustration/info (hidden on mobile)
- Right column: Auth form
- Centered on all screen sizes

---

### Sidebar
Navigation sidebar with role-based menu items.

```typescript
// Menu items by role
const menuItems = {
  ADMIN: [...],
  LEAD: ['dashboard', 'projects', 'tasks', 'users', 'profile'],
  BA: ['dashboard', 'projects', 'profile'],
  USER: ['dashboard', 'projects', 'profile']
};
```

**Features:**
- Collapsible on desktop
- Drawer on mobile
- Active route highlighting
- Role-based menu filtering

---

### Topbar
Application header with user actions.

```typescript
// Features
- Logo/app name
- Breadcrumb navigation
- User dropdown menu (profile, change password, logout)
- Mobile menu toggle
```

---

## UI Components

### Button
```typescript
<Button 
  variant="primary" // primary | secondary | danger | ghost
  size="md"         // sm | md | lg
  loading={false}
  disabled={false}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
>
  Click me
</Button>
```

### Input
```typescript
<Input
  label="Email"
  placeholder="Enter email"
  error="Invalid email"
  leftIcon={<MailIcon />}
  rightIcon={<CheckIcon />}
  type="email"
/>
```

### Select
```typescript
<Select
  label="Role"
  options={[
    { value: 'ADMIN', label: 'Admin' },
    { value: 'USER', label: 'User' }
  ]}
  value="USER"
  onChange={(value) => handleChange(value)}
  placeholder="Select role"
/>
```

### Table
```typescript
<Table
  columns={[
    { key: 'name', title: 'Name', dataIndex: 'name' },
    { key: 'email', title: 'Email', dataIndex: 'email' },
    { key: 'actions', title: 'Actions', render: (_, record) => <Actions /> }
  ]}
  dataSource={users}
  loading={false}
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100,
    onChange: (page) => handlePageChange(page)
  }}
  rowKey="id"
/>
```

### Modal
```typescript
<Modal
  open={isOpen}
  onClose={handleClose}
  title="Confirm Delete"
  footer={[
    <Button key="cancel" onClick={handleClose}>Cancel</Button>,
    <Button key="confirm" variant="danger" onClick={handleConfirm}>Delete</Button>
  ]}
>
  Are you sure?
</Modal>
```

### Drawer
```typescript
<Drawer
  open={isOpen}
  onClose={handleClose}
  title="Task Details"
  placement="right" // left | right | top | bottom
  width={400}
>
  <TaskDetails />
</Drawer>
```

### Badge
```typescript
<Badge 
  variant="success" // success | warning | danger | info | neutral
>
  Active
</Badge>
```

### Avatar
```typescript
<Avatar
  src="https://example.com/avatar.jpg"
  name="John Doe"
  size="md" // xs | sm | md | lg | xl
/>
```

### Card
```typescript
<Card
  title="Project Info"
  actions={[<Button>Edit</Button>]}
>
  <p>Card content</p>
</Card>
```

### Tabs
```typescript
<Tabs
  items={[
    { key: 'tab1', label: 'Tab 1', children: <Content1 /> },
    { key: 'tab2', label: 'Tab 2', children: <Content2 /> }
  ]}
  defaultActiveKey="tab1"
/>
```

---

## Feature Components

### KanbanBoard
Drag and drop Kanban board for task management.

```typescript
<KanbanBoard
  tasks={tasks}
  onTaskMove={(taskId, newStatus) => handleMove(taskId, newStatus)}
  onTaskClick={(task) => openTaskDetail(task)}
/>
```

**Columns:**
- TODO
- IN_PROGRESS
- REVIEW
- DONE

### TaskCard
Individual task card for Kanban board.

```typescript
<TaskCard
  task={task}
  onClick={() => openTask(task)}
  onDragStart={() => setDraggingTask(task)}
/>
```

**Display:**
- Task title
- Priority badge
- Assignee avatar
- Due date
- Subtask progress

### TaskDetailDrawer
Slide-in panel for task details.

```typescript
<TaskDetailDrawer
  open={isOpen}
  task={selectedTask}
  onClose={() => setSelectedTask(null)}
  onUpdate={(updates) => handleUpdate(updates)}
/>
```

**Sections:**
- Title (editable)
- Description
- Status selector
- Priority selector
- Assignee selector
- Due date picker
- Subtasks list
- Comments section

### UserTable
Complete user management table.

```typescript
<UserTable
  users={users}
  loading={false}
  pagination={pagination}
  onPageChange={handlePageChange}
  onEdit={(user) => openEditModal(user)}
  onDelete={(user) => confirmDelete(user)}
  onLock={(user) => handleLock(user)}
  onUnlock={(user) => handleUnlock(user)}
/>
```

### StatCard
Dashboard statistics card.

```typescript
<StatCard
  title="Total Projects"
  value={42}
  icon={<ProjectIcon />}
  trend={{ value: 12, isPositive: true }}
  color="blue"
/>
```

### AlertList
Dashboard alert for overdue/due tasks.

```typescript
<AlertList
  tasks={upcomingTasks}
  onTaskClick={(task) => navigateToTask(task)}
/>
```

---

## Toast Notifications

```typescript
import { toast } from '@/components/ui/toast';

// Success toast
toast.success('Project created successfully!');

// Error toast
toast.error('Failed to create project');

// Warning toast
toast.warning('You have unsaved changes');

// Info toast
toast.info('New update available');

// With custom duration
toast.success('Saved!', { duration: 6000 });
```

---

## Form Components

### PasswordInput
Input với show/hide toggle cho password.

```typescript
<PasswordInput
  label="Password"
  placeholder="Enter password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={errors.password}
/>
```

### UserFormModal
Modal form cho create/edit user.

```typescript
<UserFormModal
  open={isOpen}
  user={editingUser} // null = create, object = edit
  onSubmit={handleSubmit}
  onClose={() => setIsOpen(false)}
/>
```

### ProjectFormModal
Modal form cho create/edit project.

```typescript
<ProjectFormModal
  open={isOpen}
  project={editingProject}
  onSubmit={handleSubmit}
  onClose={() => setIsOpen(false)}
/>
```

### ProfileForm
Profile edit form.

```typescript
<ProfileForm
  user={currentUser}
  onSubmit={handleUpdate}
  onChangePassword={() => openChangePasswordModal()}
/>
```
