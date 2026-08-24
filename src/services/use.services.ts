import { testBackend } from '../api/user.api';

export const testBackendConnection = async () => {
  const response = await testBackend();

  return response.data;
};