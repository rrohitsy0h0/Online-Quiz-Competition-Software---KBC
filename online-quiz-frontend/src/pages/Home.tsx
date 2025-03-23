import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to the Online Quiz Competition</h1>
            <p style={styles.subtitle}>Test your knowledge and compete with others!</p>
            <div style={styles.buttonContainer}>
                <Link to="/login">
                    <button style={styles.button}>Login</button>
                </Link>
                <Link to="/register">
                    <button style={styles.button}>Register</button>
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: 'center' as const,
        padding: '50px',
        fontFamily: 'Arial, sans-serif',
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

export default Home;
