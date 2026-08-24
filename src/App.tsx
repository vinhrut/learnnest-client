import { useEffect, useState } from 'react';
import api from './api/api';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/users/test')
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error('❌ API error:', error);
      });
  }, []);

  return (
    <div>
      <h1>{message}</h1>
    </div>
  );
}

export default App;