import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.title}>Welcome to the Dashboard</h1>
                <p style={styles.subtitle}>You are now logged in. Start exploring the quiz competition!</p>
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={() => navigate('/quiz')}>Start Quiz</button>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        textAlign: 'center' as const,
        padding: '100px 50px 50px', // Added top padding to account for fixed header
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '10px',
    },
    logoutButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#FF4D4D',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    title: {
        fontSize: '2.5rem',
        color: '#333',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: '#555',
        marginBottom: '20px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Dashboard;
