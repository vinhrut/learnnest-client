import { useEffect, useState } from 'react';
import { testBackendConnection } from '../services/use.services';

export const useUsers = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    try {
      setLoading(true);

      const data = await testBackendConnection();

      console.log('Backend response:', data);

      setMessage(data.message);
    } catch (error) {
      console.error('Backend connection error:', error);

      setMessage('Cannot connect to backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return {
    message,
    loading,
    testConnection,
  };
};