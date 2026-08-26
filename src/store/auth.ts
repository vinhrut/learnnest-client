import type { User } from '../interface/user/user'

/**
 * AuthState — mô tả trạng thái authentication trong Redux store
 *
 * logged       : true khi có token hợp lệ (đã đăng nhập)
 * currentUser  : thông tin user hiện tại (populate sau khi gọi /api/me)
 * loading      : true khi đang thực hiện login/logout
 * loadingInfo  : true khi đang fetch /api/me (dùng để block route trong lúc loading)
 * errorMessage : lưu message lỗi từ API để hiển thị cho user
 */
export interface AuthState {
  logged: boolean
  currentUser?: User
  loading: boolean
  loadingInfo: boolean
  errorMessage: string
}
