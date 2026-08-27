/**
 * Biến môi trường của app, đọc một lần tại đây để tránh rải `import.meta.env`
 * khắp nơi.
 */
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('Thiếu biến môi trường VITE_API_BASE_URL (xem file .env)');
}

export const env = {
  apiBaseUrl: apiBaseUrl as string,
};
