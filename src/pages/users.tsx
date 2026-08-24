import { useUsers } from '../hooks/useUser';

const UsersPage = () => {
  const {
    message,
    loading,
    testConnection,
  } = useUsers();

  return (
    <div>
    
      <h1>Users Page</h1>

      {loading && <p>Connecting to backend...</p>}

      {!loading && (
        <p>
          {message}
        </p>
      )}

      <button onClick={testConnection}>
        Test Connection
      </button>
    </div>
  );
};


export default UsersPage;