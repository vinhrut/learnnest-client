/**
 * LoginParams — request body cho POST /api/web-authenticate
 * Backend nhận: { username, password }
 * username có thể là username hoặc email
 */
export interface LoginParams {
  username: string
  password: string
}

/**
 * AuthResponse — response body từ POST /api/web-authenticate
 * Backend trả về: { access_token, expires_in }
 */
export interface AuthResponse {
  access_token: string
  expires_in: number
}
