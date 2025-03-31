import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
      <div style={styles.headerContent}>
        <Link to="/dashboard" style={styles.logoLink}>
          <span style={styles.logo}>KBC++</span>
        </Link>
        
        {username && (
          <div style={styles.userSection}>
            <div style={styles.usernameContainer}>
              <span style={styles.usernameLabel}>Player:</span>
              <span style={styles.username}>{username}</span>
            </div>
            
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    padding: '10px 20px',
    backgroundColor: 'rgba(13, 13, 43, 0.95)',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(255, 204, 0, 0.3)',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logoLink: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold' as const,
    color: '#ffcc00',
    textShadow: '0 0 10px rgba(255, 204, 0, 0.5)',
    letterSpacing: '1px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  usernameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  usernameLabel: {
    fontSize: '0.9rem',
    color: '#ccc',
  },
  username: {
    fontWeight: 'bold' as const,
    fontSize: '1rem',
    color: '#ffcc00',
  },
  logoutButton: {
    padding: '6px 15px',
    fontSize: '0.9rem',
    color: '#fff',
    backgroundColor: 'rgba(255, 77, 77, 0.2)',
    border: '1px solid rgba(255, 77, 77, 0.5)',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};

// Add hover effect for the logout button
document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.querySelector('button');
  if (logoutButton) {
    logoutButton.addEventListener('mouseenter', (e) => {
      const target = e.currentTarget as HTMLElement;
      target.style.backgroundColor = 'rgba(255, 77, 77, 0.4)';
      target.style.border = '1px solid rgba(255, 77, 77, 0.8)';
    });
    
    logoutButton.addEventListener('mouseleave', (e) => {
      const target = e.currentTarget as HTMLElement;
      target.style.backgroundColor = 'rgba(255, 77, 77, 0.2)';
      target.style.border = '1px solid rgba(255, 77, 77, 0.5)';
    });
  }
});

export default Header;
