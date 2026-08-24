import axiosInstance from './axios';

export const testBackend = () => {
  return axiosInstance.get('/users/test');
};