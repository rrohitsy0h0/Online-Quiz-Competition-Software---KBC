import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import api from '../services/api';

const Dashboard: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [score, setScore] = useState<number>(0);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Simple JWT decoding without external library
                const payload = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payload));
                setUsername(decodedPayload.username);

                // Fetch user score
                const fetchUserData = async () => {
                    try {
                        const response = await api.get('/auth/me', {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        if (response.data && response.data.score) {
                            setScore(response.data.score);
                        }
                    } catch (error) {
                        console.error('Error fetching user data:', error);
                    } finally {
                        setLoading(false);
                    }
                };
                
                fetchUserData();
            } catch (error) {
                console.error('Invalid token', error);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div style={styles.pageContainer}>
            <div style={styles.overlay}></div>
            <Header />
            
            <div style={styles.content}>
                <div style={styles.welcomeSection}>
                    <div style={styles.logoContainer}>
                        <h1 style={styles.logo}>KBC++</h1>
                        <div style={styles.logoUnderline}></div>
                    </div>
                    
                    <h2 style={styles.welcomeText}>
                        Welcome, <span style={styles.usernameHighlight}>{username || 'Player'}</span>!
                    </h2>
                    
                    <p style={styles.subtitle}>
                        Are you ready to test your knowledge and win big?
                    </p>
                </div>
                
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>🎮</div>
                        <div style={styles.statValue}>16</div>
                        <div style={styles.statLabel}>Levels</div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>⏱️</div>
                        <div style={styles.statValue}>4</div>
                        <div style={styles.statLabel}>Lifelines</div>
                    </div>
                </div>
                
                <button onClick={() => navigate('/quiz')} style={styles.startButton}>
                    Start Quiz
                    <span style={styles.startButtonArrow}>→</span>
                </button>
                
                <div style={styles.infoCards}>
                    <div style={styles.infoCard}>
                        <h3 style={styles.infoCardTitle}>How to Play</h3>
                        <ul style={styles.infoList}>
                            <li>Answer questions correctly to progress through levels</li>
                            <li>Each level increases in difficulty and reward</li>
                            <li>Use lifelines wisely when you're stuck</li>
                            <li>Early levels have time limits, later levels don't</li>
                        </ul>
                    </div>
                    
                    <div style={styles.infoCard}>
                        <h3 style={styles.infoCardTitle}>Lifelines</h3>
                        <ul style={styles.infoList}>
                            <li><strong>50:50</strong> - Eliminates two wrong answers</li>
                            <li><strong>Audience Poll</strong> - Shows audience vote percentages</li>
                            <li><strong>Flip Question</strong> - Changes to a different question</li>
                            <li><strong>Expert's Advice</strong> - Reveals the correct answer</li>
                        </ul>
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
    pageContainer: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #1a1a3d 0%, #0d0d2b 100%)',
        position: 'relative' as const,
        color: '#fff',
        fontFamily: '"Montserrat", Arial, sans-serif',
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
        width: '100%',
        maxWidth: '1200px',
        margin: '80px auto 0',
        padding: '40px 20px',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
    },
    welcomeSection: {
        textAlign: 'center' as const,
        marginBottom: '40px',
    },
    logoContainer: {
        marginBottom: '30px',
    },
    logo: {
        fontSize: '3.5rem',
        fontWeight: 'bold' as const,
        color: '#ffcc00',
        margin: '0 0 10px 0',
        textShadow: '0 0 15px rgba(255, 204, 0, 0.5)',
        letterSpacing: '2px',
    },
    logoUnderline: {
        width: '80px',
        height: '4px',
        background: 'linear-gradient(90deg, transparent, #ffcc00, transparent)',
        margin: '0 auto',
    },
    welcomeText: {
        fontSize: '2.2rem',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '15px',
    },
    usernameHighlight: {
        color: '#ffcc00',
        position: 'relative' as const,
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#ccc',
        maxWidth: '600px',
        margin: '0 auto',
    },
    statsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        marginBottom: '40px',
        flexWrap: 'wrap' as const,
    },
    statCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '25px',
        borderRadius: '15px',
        textAlign: 'center' as const,
        minWidth: '180px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
        },
    },
    statIcon: {
        fontSize: '2.5rem',
        marginBottom: '10px',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 'bold' as const,
        color: '#ffcc00',
        marginBottom: '5px',
    },
    statLabel: {
        fontSize: '1rem',
        color: '#ddd',
    },
    startButton: {
        backgroundColor: '#ffcc00',
        color: '#1a1a3d',
        fontSize: '1.2rem',
        fontWeight: 'bold' as const,
        padding: '16px 40px',
        borderRadius: '50px',
        border: 'none',
        cursor: 'pointer',
        marginBottom: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 5px 15px rgba(255, 204, 0, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#ffd700',
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 25px rgba(255, 204, 0, 0.4)',
        },
        '&:active': {
            transform: 'translateY(1px)',
        },
    },
    startButtonArrow: {
        marginLeft: '10px',
        fontSize: '1.4rem',
        transition: 'transform 0.3s ease',
    },
    infoCards: {
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        width: '100%',
        flexWrap: 'wrap' as const,
        marginBottom: '40px',
    },
    infoCard: {
        backgroundColor: 'rgba(22, 22, 60, 0.8)',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        flex: '1',
        minWidth: '280px',
        maxWidth: '450px',
    },
    infoCardTitle: {
        fontSize: '1.4rem',
        color: '#ffcc00',
        marginBottom: '15px',
        textAlign: 'center' as const,
    },
    infoList: {
        paddingLeft: '20px',
        margin: 0,
        '& li': {
            marginBottom: '10px',
            color: '#ddd',
            lineHeight: '1.5',
        },
    },
    footer: {
        width: '100%',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        textAlign: 'center' as const,
        zIndex: 2,
        marginTop: 'auto',
    },
    footerText: {
        color: '#888',
        fontSize: '0.9rem',
    },
};

// Add hover effects with JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effect to stat cards
    const statCards = document.querySelectorAll('[style*="statCard"]');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'translateY(-5px)';
            target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // Add hover effect to start button
    const startButton = document.querySelector('button');
    if (startButton) {
        startButton.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = '#ffd700';
            target.style.transform = 'translateY(-3px)';
            target.style.boxShadow = '0 8px 25px rgba(255, 204, 0, 0.4)';
            
            // Also animate the arrow
            const arrow = target.querySelector('span');
            if (arrow) {
                arrow.style.transform = 'translateX(5px)';
            }
        });
        
        startButton.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = '#ffcc00';
            target.style.transform = 'translateY(0)';
            target.style.boxShadow = '0 5px 15px rgba(255, 204, 0, 0.3)';
            
            // Reset arrow position
            const arrow = target.querySelector('span');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
        
        startButton.addEventListener('mousedown', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'translateY(1px)';
        });
        
        startButton.addEventListener('mouseup', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.transform = 'translateY(-3px)';
        });
    }
});

export default Dashboard;
