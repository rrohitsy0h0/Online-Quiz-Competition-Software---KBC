import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    const [showHowToPlay, setShowHowToPlay] = useState(false);

    const toggleHowToPlay = () => {
        setShowHowToPlay(!showHowToPlay);
    };

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
                
                <button 
                    onClick={toggleHowToPlay} 
                    style={styles.howToPlayButton}
                >
                    {showHowToPlay ? 'Hide Instructions' : 'How To Play'}
                </button>
                
                {showHowToPlay && (
                    <div style={styles.howToPlayContainer}>
                        <h3 style={styles.howToPlayTitle}>Game Instructions</h3>
                        
                        <div style={styles.instructionSection}>
                            <h4 style={styles.instructionTitle}>Gameplay</h4>
                            <ul style={styles.instructionList}>
                                <li>Answer increasingly difficult questions to progress through 16 levels</li>
                                <li>Each question has 4 possible answers, only one is correct</li>
                                <li>Early levels (1-10) have time limits, while later levels (11-16) allow unlimited time</li>
                                <li>Answer correctly to advance; answer incorrectly and the game ends</li>
                            </ul>
                        </div>
                        
                        <div style={styles.instructionSection}>
                            <h4 style={styles.instructionTitle}>Lifelines</h4>
                            <div style={styles.lifelinesGrid}>
                                <div style={styles.lifelineItem}>
                                    <span style={styles.lifelineIcon}>🎯</span>
                                    <div style={styles.lifelineContent}>
                                        <h5 style={styles.lifelineName}>50:50</h5>
                                        <p style={styles.lifelineDescription}>Eliminates two incorrect answers, leaving the correct answer and one wrong answer</p>
                                    </div>
                                </div>
                                
                                <div style={styles.lifelineItem}>
                                    <span style={styles.lifelineIcon}>📊</span>
                                    <div style={styles.lifelineContent}>
                                        <h5 style={styles.lifelineName}>Audience Poll</h5>
                                        <p style={styles.lifelineDescription}>Shows percentage-based audience votes for each option</p>
                                    </div>
                                </div>
                                
                                <div style={styles.lifelineItem}>
                                    <span style={styles.lifelineIcon}>🔄</span>
                                    <div style={styles.lifelineContent}>
                                        <h5 style={styles.lifelineName}>Flip the Question</h5>
                                        <p style={styles.lifelineDescription}>Changes to a different question of the same difficulty level</p>
                                    </div>
                                </div>
                                
                                <div style={styles.lifelineItem}>
                                    <span style={styles.lifelineIcon}>👨‍🏫</span>
                                    <div style={styles.lifelineContent}>
                                        <h5 style={styles.lifelineName}>Expert's Advice</h5>
                                        <p style={styles.lifelineDescription}>Reveals the correct answer to the current question</p>
                                    </div>
                                </div>
                            </div>
                            <p style={styles.lifelineNote}>Each lifeline can only be used once per game</p>
                        </div>
                        
                        <div style={styles.instructionSection}>
                            <h4 style={styles.instructionTitle}>Scoring</h4>
                            <ul style={styles.instructionList}>
                                <li>Each level has a specific prize amount:</li>
                                <li>Level 1: ₹1,000 | Level 2: ₹2,000 | Level 3: ₹3,000 | Level 4: ₹5,000</li>
                                <li>Level 5: ₹10,000 | Level 6: ₹20,000 | Level 7: ₹40,000 | Level 8: ₹80,000</li>
                                <li>Level 9: ₹1,60,000 | Level 10: ₹3,20,000 | Level 11: ₹6,40,000</li>
                                <li>Level 12: ₹12,50,000 | Level 13: ₹25,00,000 | Level 14: ₹50,00,000</li>
                                <li>Level 15: ₹75,00,000 | Level 16: ₹1,00,00,000 (1 Crore)</li>
                            </ul>
                        </div>
                    </div>
                )}
                
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
    howToPlayButton: {
        backgroundColor: 'transparent',
        color: '#ffcc00',
        border: '1px solid #ffcc00',
        padding: '8px 15px',
        borderRadius: '5px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
    },
    howToPlayContainer: {
        backgroundColor: 'rgba(26, 26, 61, 0.8)',
        padding: '25px',
        borderRadius: '15px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 204, 0, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        maxWidth: '800px',
        width: '100%',
        marginBottom: '30px',
        animation: 'fadeIn 0.5s ease',
    },
    howToPlayTitle: {
        fontSize: '1.8rem',
        color: '#ffcc00',
        textAlign: 'center' as const,
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255, 204, 0, 0.3)',
        paddingBottom: '10px',
    },
    instructionSection: {
        marginBottom: '20px',
    },
    instructionTitle: {
        fontSize: '1.3rem',
        color: '#ffcc00',
        marginBottom: '10px',
    },
    instructionList: {
        textAlign: 'left' as const,
        paddingLeft: '20px',
        marginBottom: '15px',
        '& li': {
            marginBottom: '8px',
            color: '#ddd',
        },
    },
    lifelinesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '15px',
        padding: '0',
    },
    lifelineItem: {
        display: 'flex',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '15px',
        borderRadius: '8px',
        textAlign: 'left' as const,
    },
    lifelineIcon: {
        fontSize: '1.8rem',
        marginRight: '15px',
        marginTop: '3px',
    },
    lifelineContent: {
        flex: '1',
    },
    lifelineName: {
        fontSize: '1.1rem',
        color: '#ffcc00',
        marginTop: '0',
        marginBottom: '5px',
    },
    lifelineDescription: {
        fontSize: '0.9rem',
        color: '#ddd',
        margin: '0',
        lineHeight: '1.4',
    },
    lifelineNote: {
        fontSize: '0.9rem',
        color: '#ffcc00',
        fontStyle: 'italic',
        textAlign: 'center' as const,
        marginTop: '15px',
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

    const howToPlayBtn = document.querySelector('button[style*="howToPlayButton"]');
    if (howToPlayBtn) {
        howToPlayBtn.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = 'rgba(255, 204, 0, 0.2)';
            target.style.transform = 'translateY(-2px)';
        });
        
        howToPlayBtn.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = 'transparent';
            target.style.transform = 'translateY(0)';
        });
    }
    
    const lifelineItems = document.querySelectorAll('[style*="lifelineItem"]');
    lifelineItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            target.style.transform = 'translateY(-3px)';
        });
        
        item.addEventListener('mouseleave', (e) => {
            const target = e.currentTarget as HTMLElement;
            target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            target.style.transform = 'translateY(0)';
        });
    });
});

// Add a global stylesheet for animations
const addGlobalStyle = (css: string) => {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
};

// Add fadeIn animation
addGlobalStyle(`
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`);

export default Home;
