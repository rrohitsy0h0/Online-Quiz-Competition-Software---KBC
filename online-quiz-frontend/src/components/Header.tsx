import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  username: string;
  id: string;
  exp: number;
}

const Header: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Simple JWT decoding without external library
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        setUsername(decodedPayload.username);
      } catch (error) {
        console.error('Invalid token', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={styles.header}>
      {username && (
        <div style={styles.usernameContainer}>
          <span style={styles.username}>Username: {username}</span>
        </div>
      )}
      {username && (
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#f8f9fa',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  usernameContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  username: {
    fontWeight: 'bold' as const,
    fontSize: '1rem',
    color: '#333',
  },
  logoutButton: {
    padding: '5px 10px',
    fontSize: '0.9rem',
    color: '#fff',
    backgroundColor: '#FF4D4D',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Header;
