/**
 * RoleCode — định nghĩa các vai trò từ backend
 * Giữ nguyên tên field 'code' như backend trả về
 */
export type RoleCode = 'LEAD' | 'BA' | 'DEV'

/**
 * Role — mô tả một role trong hệ thống (từ backend)
 */
export interface Role {
  id: number
  name: string
  code: RoleCode
  sort: number
}

/**
 * User interface — mô tả cấu trúc thông tin người dùng từ backend
 * Backend trả về: { data: { id, uuid, name, username, email, phoneNumber, status, roles[] } }
 * Roles được lưu dạng array — kiểm tra bằng: currentUser.roles.some(r => r.code === 'SYSADMIN')
 */
export interface User {
  id: number
  uuid: string
  name: string
  username: string
  email: string
  phoneNumber: string | null
  status: number
  roles: Role[]
}

/**
 * Helper — kiểm tra user có role cụ thể không
 */
export function hasRole(user: User | undefined, code: RoleCode): boolean {
  return user?.roles?.some((r) => r.code === code) ?? false
}

/**
 * Helper — kiểm tra user có bất kỳ role nào trong danh sách không
 */
export function hasAnyRole(user: User | undefined, codes: RoleCode[]): boolean {
  return user?.roles?.some((r) => codes.includes(r.code)) ?? false
}

/**
 * Helper — lấy primary role (role có sort nhỏ nhất) của user
 */
export function getPrimaryRole(user: User | undefined): Role | undefined {
  if (!user?.roles?.length) return undefined
  return [...user.roles].sort((a, b) => a.sort - b.sort)[0]
}

export const ROLE_HOME = {
  LEAD: "lead",
  BA: "ba",
  DEV: "dev",
} as const;

export type RoleHomeValue = (typeof ROLE_HOME)[keyof typeof ROLE_HOME];

export const ROLE_PIORITY: (keyof typeof ROLE_HOME)[] = [
  "LEAD",
  "DEV",
  "BA",
];

/**
 * Helper — redirect path theo primary role của user
 */
export function getDashboardPath(user?: User): string {
  const roles = user?.roles?.map((r) => r.code) || [];
  if (roles.length === 0) return "";

  // 2. Fallback theo priority
  const role = ROLE_PIORITY.find((r) => roles.includes(r));
  return role ? `/${ROLE_HOME[role]}` : "";
}
