import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div style={styles.container}>
            <div style={styles.overlay}></div>
            <div style={styles.content}>
                <div style={styles.logoContainer}>
                    <h1 style={styles.logo}>KBC++</h1>
                    <div style={styles.logoUnderline}></div>
                </div>
                
                <h2 style={styles.tagline}>Who Wants to Be a Millionaire?</h2>
                
                <p style={styles.subtitle}>
                    Test your knowledge, use lifelines wisely, and win money!!
                </p>
                
                <div style={styles.buttonContainer}>
                    <Link to="/login">
                        <button style={styles.loginButton}>
                            <span style={styles.buttonText}>LOGIN</span>
                        </button>
                    </Link>
                    <Link to="/register">
                        <button style={styles.registerButton}>
                            <span style={styles.buttonText}>REGISTER</span>
                        </button>
                    </Link>
                </div>
                
                <div style={styles.features}>
                    <div style={styles.featureItem}>
                        <span style={styles.featureIcon}>🎮</span>
                        <span style={styles.featureText}>Progressive Difficulty</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span style={styles.featureIcon}>⏱️</span>
                        <span style={styles.featureText}>Time-based Challenges</span>
                    </div>
                    <div style={styles.featureItem}>
                        <span style={styles.featureIcon}>🔄</span>
                        <span style={styles.featureText}>Lifelines</span>
                    </div>
                </div>
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
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a1a3d 0%, #0d0d2b 100%)',
        position: 'relative' as const,
        color: '#fff',
        fontFamily: '"Montserrat", Arial, sans-serif',
        overflow: 'hidden' as const,
    },
    overlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 25% 30%, rgba(41, 62, 183, 0.2) 0%, transparent 60%), radial-gradient(circle at 75% 70%, rgba(59, 46, 128, 0.3) 0%, transparent 50%)',
        zIndex: 1,
    },
    content: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '60px 20px',
        zIndex: 2,
        width: '100%',
        maxWidth: '1000px',
        textAlign: 'center' as const,
    },
    logoContainer: {
        marginBottom: '10px',
        position: 'relative' as const,
    },
    logo: {
        fontSize: '5rem',
        fontWeight: 'bold' as const,
        color: '#ffcc00',
        margin: '0 0 10px 0',
        textShadow: '0 0 15px rgba(255, 204, 0, 0.5)',
        letterSpacing: '3px',
    },
    logoUnderline: {
        width: '80px',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #ffcc00, transparent)',
        margin: '0 auto',
    },
    tagline: {
        fontSize: '2rem',
        fontWeight: '600',
        color: '#fff',
        margin: '20px 0 10px',
        letterSpacing: '1px',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#ccc',
        marginBottom: '40px',
        maxWidth: '700px',
        lineHeight: '1.5',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginBottom: '50px',
        flexWrap: 'wrap' as const,
    },
    loginButton: {
        padding: '14px 40px',
        fontSize: '1.1rem',
        backgroundColor: '#ffcc00',
        color: '#1a1a3d',
        border: 'none',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: 'bold' as const,
        boxShadow: '0 5px 15px rgba(255, 204, 0, 0.3)',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        '&:hover': {
            backgroundColor: '#ffd700',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(255, 204, 0, 0.4)',
        },
    },
    registerButton: {
        padding: '14px 40px',
        fontSize: '1.1rem',
        backgroundColor: 'transparent',
        color: '#ffcc00',
        border: '2px solid #ffcc00',
        borderRadius: '50px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: 'bold' as const,
        boxShadow: '0 5px 15px rgba(255, 204, 0, 0.1)',
        '&:hover': {
            backgroundColor: 'rgba(255, 204, 0, 0.1)',
            transform: 'translateY(-2px)',
        },
    },
    buttonText: {
        position: 'relative' as const,
        zIndex: 1,
    },
    features: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap' as const,
        gap: '30px',
        margin: '20px 0',
    },
    featureItem: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        width: '200px',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        cursor: 'default',
        '&:hover': {
            transform: 'translateY(-5px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
    },
    featureIcon: {
        fontSize: '2rem',
        marginBottom: '10px',
    },
    featureText: {
        fontSize: '1rem',
        color: '#ddd',
    },
    footer: {
        width: '100%',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        textAlign: 'center' as const,
        zIndex: 2,
    },
    footerText: {
        color: '#888',
        fontSize: '0.9rem',
    },
};

// Add hover effects with JavaScript since inline styles don't support pseudo-classes
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.querySelector('a[href="/login"] button');
    const registerBtn = document.querySelector('a[href="/register"] button');
    const featureItems = document.querySelectorAll('[style*="featureItem"]');
    
    if (loginBtn) {
        loginBtn.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = '#ffd700';
            target.style.transform = 'translateY(-2px)';
            target.style.boxShadow = '0 8px 20px rgba(255, 204, 0, 0.4)';
        });
        
        loginBtn.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = '#ffcc00';
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = '0 5px 15px rgba(255, 204, 0, 0.3)';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = 'rgba(255, 204, 0, 0.1)';
            target.style.transform = 'translateY(-2px)';
        });
        
        registerBtn.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = 'transparent';
            target.style.transform = 'translateY(0)';
        });
    }
    
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'translateY(-5px)';
            target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        item.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'translateY(0)';
            target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        });
    });
});

export default Home;
