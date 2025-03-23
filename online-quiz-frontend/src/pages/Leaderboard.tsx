import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../services/api';

interface LeaderboardEntry {
    username: string;
    maxScore: number; // Display the maximum score
    timeTaken: number;
}

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await api.get('/leaderboard');
                setLeaderboard(response.data); // Ensure leaderboard data is set
                console.log('Leaderboard data fetched:', response.data); // Debugging log
            } catch (err: any) {
                console.error('Error fetching leaderboard:', err.response?.data || err.message);
                setError('Failed to load leaderboard. Please try again later.');
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div style={styles.container}>
            <button onClick={() => navigate('/dashboard')} style={styles.backButton}>
                Back to Dashboard
            </button>
            <h1 style={styles.title}>Leaderboard</h1>
            {error && <p style={styles.error}>{error}</p>}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Rank</th>
                        <th style={styles.th}>Username</th>
                        <th style={styles.th}>Max Score</th>
                        <th style={styles.th}>Time Taken</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((entry, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{index + 1}</td>
                            <td style={styles.td}>{entry.username}</td>
                            <td style={styles.td}>{entry.maxScore}</td>
                            <td style={styles.td}>{entry.timeTaken} seconds</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '50px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center' as const,
        position: 'relative' as const,
    },
    backButton: {
        position: 'absolute' as const,
        top: '10px',
        left: '10px',
        padding: '10px 15px',
        fontSize: '0.9rem',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    title: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '20px',
    },
    error: {
        color: 'red',
        fontSize: '1rem',
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse' as const,
        marginTop: '20px',
    },
    th: {
        border: '1px solid #ddd',
        padding: '10px',
        backgroundColor: '#f4f4f4',
        fontWeight: 'bold',
    },
    td: {
        border: '1px solid #ddd',
        padding: '10px',
    },
};

export default Leaderboard;
