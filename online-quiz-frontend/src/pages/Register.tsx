import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        
        try {
            await api.post('/auth/register', { username, password });
            setSuccess('Registration successful! Redirecting to login...');
            setError('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            console.error('Registration error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            <div style={styles.overlay}></div>
            
            <div style={styles.container}>
                <Link to="/" style={styles.backLink}>
                    <span style={styles.backIcon}>←</span> Back to Home
                </Link>
                
                <div style={styles.logoContainer}>
                    <h1 style={styles.logo}>KBC++</h1>
                    <div style={styles.logoUnderline}></div>
                </div>
                
                <h2 style={styles.title}>Create Account</h2>
                
                <form onSubmit={handleRegister} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Choose a username"
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Create a password"
                        />
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Confirm your password"
                        />
                    </div>
                    
                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}
                    
                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                    
                    <p style={styles.loginText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.loginLink}>
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
            
            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    KBC++ 2025 | The Ultimate Quiz Experience
                </p>
            </footer>
        </div>
    );
};

const styles = {
    pageContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a1a3d 0%, #0d0d2b 100%)',
        position: 'relative' as const,
        padding: '20px',
        color: '#fff',
        fontFamily: '"Montserrat", Arial, sans-serif',
    },
    overlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 15% 30%, rgba(41, 62, 183, 0.2) 0%, transparent 60%), radial-gradient(circle at 85% 70%, rgba(59, 46, 128, 0.3) 0%, transparent 50%)',
        zIndex: 1,
    },
    container: {
        width: '100%',
        maxWidth: '500px',
        margin: '30px auto',
        padding: '35px 40px',
        backgroundColor: 'rgba(22, 22, 60, 0.8)',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative' as const,
        zIndex: 2,
    },
    backLink: {
        display: 'inline-flex',
        alignItems: 'center',
        color: '#ccc',
        marginBottom: '25px',
        textDecoration: 'none',
        fontSize: '0.9rem',
        transition: 'color 0.3s',
    },
    backIcon: {
        fontSize: '1.2rem',
        marginRight: '5px',
    },
    logoContainer: {
        marginBottom: '20px',
        textAlign: 'center' as const,
    },
    logo: {
        fontSize: '3rem',
        fontWeight: 'bold' as const,
        color: '#ffcc00',
        margin: '0 0 8px 0',
        textShadow: '0 0 15px rgba(255, 204, 0, 0.5)',
    },
    logoUnderline: {
        width: '60px',
        height: '3px',
        background: 'linear-gradient(90deg, transparent, #ffcc00, transparent)',
        margin: '0 auto',
    },
    title: {
        fontSize: '1.8rem',
        textAlign: 'center' as const,
        color: '#fff',
        marginBottom: '30px',
        fontWeight: '600',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
    },
    label: {
        fontSize: '1rem',
        color: '#ddd',
        fontWeight: '500',
    },
    input: {
        padding: '12px 15px',
        fontSize: '1rem',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '8px',
        color: '#fff',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        outline: 'none',
    },
    button: {
        padding: '14px',
        fontSize: '1.1rem',
        backgroundColor: '#ffcc00',
        color: '#1a1a3d',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold' as const,
        transition: 'all 0.3s ease',
        marginTop: '10px',
        boxShadow: '0 4px 12px rgba(255, 204, 0, 0.3)',
    },
    error: {
        color: '#ff6b6b',
        fontSize: '0.9rem',
        textAlign: 'center' as const,
        margin: '0',
    },
    success: {
        color: '#2ecc71',
        fontSize: '0.9rem',
        textAlign: 'center' as const,
        margin: '0',
    },
    loginText: {
        fontSize: '0.9rem',
        color: '#bbb',
        textAlign: 'center' as const,
        marginTop: '10px',
    },
    loginLink: {
        color: '#ffcc00',
        textDecoration: 'none',
        fontWeight: '500',
    },
    footer: {
        width: '100%',
        padding: '20px',
        textAlign: 'center' as const,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 2,
        marginTop: 'auto',
    },
    footerText: {
        color: '#888',
        fontSize: '0.9rem',
    },
};

// Add custom effects after component is mounted
document.addEventListener('DOMContentLoaded', () => {
    // Get all input elements
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.borderColor = '#ffcc00';
            target.style.boxShadow = '0 0 0 2px rgba(255, 204, 0, 0.2)';
        });
        
        // Remove focus effect
        input.addEventListener('blur', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            target.style.boxShadow = 'none';
        });
    });
    
    // Add hover effect to register button
    const button = document.querySelector('button[type="submit"]');
    if (button && !button.hasAttribute('disabled')) {
        button.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = '#ffd700';
            target.style.transform = 'translateY(-2px)';
            target.style.boxShadow = '0 6px 15px rgba(255, 204, 0, 0.4)';
        });
        
        button.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = '#ffcc00';
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = '0 4px 12px rgba(255, 204, 0, 0.3)';
        });
        
        button.addEventListener('mousedown', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'translateY(-2px)';
        });
    }
    
    // Add hover effect to the back link
    const backLink = document.querySelector('a[style*="backLink"]');
    if (backLink) {
        backLink.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.color = '#ffcc00';
        });
        
        backLink.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.color = '#ccc';
        });
    }
    
    // Add hover effect to login link
    const loginLink = document.querySelector('a[style*="loginLink"]');
    if (loginLink) {
        loginLink.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.textDecoration = 'underline';
        });
        
        loginLink.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.textDecoration = 'none';
        });
    }
});

export default Register;
