import { io, type Socket } from 'socket.io-client';
import { env } from '@/config/env';
import { authStore } from '@/stores/auth.store';

/**
 * Socket realtime dùng chung (namespace `/realtime` của backend).
 *
 * Một instance duy nhất cho cả app. `autoConnect: false` — gọi `connectSocket()`
 * sau khi đã đăng nhập. Access token đọc lại mỗi lần (re)connect nên token mới
 * sau khi refresh vẫn dùng được.
 */
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(`${env.apiBaseUrl}/realtime`, {
      autoConnect: false,
      transports: ['websocket'],
      auth: (cb) => cb({ token: authStore.getState().accessToken ?? '' }),
    });
  }
  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) s.connect();
}

export function disconnectSocket(): void {
  if (socket?.connected) socket.disconnect();
}
