import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Header from '../components/Header';

interface Question {
    _id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    timeLimit: number;
    level: number;
}

const StartQuiz: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(45);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const resetLifelines = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.post('/questions/reset-lifelines', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Lifelines reset successfully');
        } catch (err: any) {
            console.error('Error resetting lifelines:', err.response?.data || err.message);
            setError('Failed to reset lifelines. Please try again later.');
        }
    };

    useEffect(() => {
        resetLifelines();
    }, []);

    useEffect(() => {
        const fetchQuestion = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const response = await api.get(`/questions?level=${currentLevel}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (response.data && response.data.length > 0) {
                    // Select one random question from all level questions
                    const randomIndex = Math.floor(Math.random() * response.data.length);
                    const question = response.data[randomIndex];
                    setCurrentQuestion(question);
                    setTimeLeft(question.timeLimit);
                } else {
                    alert("Congratulations! You've completed all levels!");
                    navigate('/dashboard');
                }
            } catch (err: any) {
                console.error('Error fetching question:', err.response?.data || err.message);
                setError('Failed to load question. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [currentLevel, navigate]);

    useEffect(() => {
        if (currentQuestion) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        alert('Time is up! Game over.');
                        navigate('/dashboard');
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [currentQuestion, navigate]);

    const handleAnswerSubmit = async () => {
        if (!selectedAnswer || !currentQuestion) {
            setError('Please select an answer.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/questions/answer', {
                questionId: currentQuestion._id,
                answer: selectedAnswer,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            // Instead of relying on response.nextLevel, manually increment the level
            setCurrentLevel(currentQuestion.level + 1);
            setSelectedAnswer('');
            setError('');
        } catch (err: any) {
            if (err.response?.status === 400 && err.response?.data?.message === 'Wrong answer. Redirecting to dashboard.') {
                navigate('/dashboard');
            } else {
                console.error('Error submitting answer:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to submit answer. Please try again.');
            }
        }
    };

    const handleUseLifeline = async (lifelineType: string) => {
        if (!currentQuestion) return;

        try {
            console.log(`Using lifeline: ${lifelineType}`);
            
            const token = localStorage.getItem('token');
            const response = await api.post('/questions/lifeline', {
                lifelineType,
                questionId: currentQuestion._id,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Lifeline response:', response.data);

            const { result } = response.data;
            if (lifelineType === '5050') {
                // Update the current question's options
                setCurrentQuestion({
                    ...currentQuestion,
                    options: result
                });
            } else if (lifelineType === 'showAnswer') {
                alert(`The correct answer is: ${result}`);
            } else if (lifelineType === 'changeQuestion') {
                // Replace the current question with a new one
                setCurrentQuestion(result);
                setTimeLeft(result.timeLimit);
                setSelectedAnswer('');
            }
        } catch (err: any) {
            console.error('Error using lifeline:', err.response?.data || err.message);
            if (err.response?.data?.message === 'Lifeline already used') {
                setError('This lifeline has already been used.');
            } else if (err.response?.data?.message === 'No alternative questions available for this level.') {
                setError('No alternative questions available for this level.');
            } else {
                setError(err.response?.data?.message || 'Failed to use lifeline. Please try again.');
            }
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>Loading question...</p>
                </div>
            </>
        );
    }

    if (!currentQuestion) {
        return (
            <>
                <Header />
                <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p>No questions available.</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div style={styles.container}>
                <div style={styles.timerContainer}>
                    <p style={styles.timer}>Time Left: {timeLeft} seconds</p>
                </div>
                <h1 style={styles.title}>Quiz</h1>
                <p style={styles.level}>Level: {currentLevel}</p>
                <p style={styles.question}>{currentQuestion.questionText}</p>
                <div style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <label key={index} style={styles.option}>
                            <input
                                type="radio"
                                name="answer"
                                value={option}
                                checked={selectedAnswer === option}
                                onChange={(e) => setSelectedAnswer(e.target.value)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button onClick={handleAnswerSubmit} style={styles.button}>Submit Answer</button>
                <div style={styles.lifelineContainer}>
                    <button onClick={() => handleUseLifeline('5050')} style={styles.lifelineButton}>50:50</button>
                    <button onClick={() => handleUseLifeline('audiencePoll')} style={styles.lifelineButton}>Audience Poll</button>
                    <button onClick={() => handleUseLifeline('changeQuestion')} style={styles.lifelineButton}>Flip the Question</button>
                    <button onClick={() => handleUseLifeline('showAnswer')} style={styles.lifelineButton}>Show Answer</button>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '100px auto 50px', // Added top margin to account for fixed header
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center' as const,
        position: 'relative' as const,
    },
    timerContainer: {
        position: 'absolute' as const,
        top: '10px',
        right: '10px',
    },
    timer: {
        fontSize: '1.2rem',
        color: 'red',
    },
    title: {
        fontSize: '2rem',
        color: '#333',
        marginBottom: '20px',
    },
    level: {
        fontSize: '1.2rem',
        color: '#555',
        marginBottom: '10px',
    },
    question: {
        fontSize: '1.2rem',
        color: '#555',
        marginBottom: '20px',
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'flex-start' as const,
        gap: '10px',
        marginBottom: '20px',
    },
    option: {
        fontSize: '1rem',
        color: '#333',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '20px',
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
        marginBottom: '20px',
    },
    lifelineContainer: {
        display: 'flex',
        justifyContent: 'center' as const,
        gap: '10px',
        marginTop: '20px',
    },
    lifelineButton: {
        padding: '10px 15px',
        fontSize: '0.9rem',
        color: '#fff',
        backgroundColor: '#28a745',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default StartQuiz;