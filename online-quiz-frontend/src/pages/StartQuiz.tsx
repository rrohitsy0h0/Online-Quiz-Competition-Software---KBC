import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Question {
    _id: string;
    questionText: string;
    options: string[];
    correctAnswer: string;
    timeLimit: number;
    level: number;
}

const StartQuiz: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(45); // Initialize time limit to 45 seconds
    const [currentLevel, setCurrentLevel] = useState(1); // Track the current level
    const navigate = useNavigate();

    const resetLifelines = async () => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            await api.post('/questions/reset-lifelines', {}, {
                headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
            });
            console.log('Lifelines reset successfully'); // Debugging log
        } catch (err: any) {
            console.error('Error resetting lifelines:', err.response?.data || err.message);
            setError('Failed to reset lifelines. Please try again later.');
        }
    };

    useEffect(() => {
        resetLifelines(); // Reset lifelines when the quiz starts
    }, []);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token'); // Get token from localStorage
                const response = await api.get(`/questions?level=${currentLevel}`, {
                    headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
                });
                setQuestions(response.data);
                setCurrentQuestionIndex(0); // Reset question index for the new level
            } catch (err: any) {
                console.error('Error fetching questions:', err.response?.data || err.message);
                setError('Failed to load questions. Please try again later.');
            }
        };

        fetchQuestions();
    }, [currentLevel]); // Trigger fetchQuestions when currentLevel changes

    useEffect(() => {
        if (questions.length > 0) {
            const currentQuestion = questions[currentQuestionIndex];
            setTimeLeft(currentQuestion.timeLimit); // Dynamically set time limit based on the current question

            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        alert('Time is up! Game over.');
                        navigate('/dashboard'); // Redirect to dashboard on timeout
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer); // Clear timer on component unmount or question change
        }
    }, [currentQuestionIndex, questions]);

    const handleAnswerSubmit = async () => {
        if (!selectedAnswer) {
            setError('Please select an answer.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const currentQuestion = questions[currentQuestionIndex];
            const response = await api.post('/questions/answer', {
                questionId: currentQuestion._id,
                answer: selectedAnswer,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.nextLevel !== undefined) {
                setCurrentLevel(response.data.nextLevel); // Move to the next level
                setCurrentQuestionIndex(0); // Reset to the first question of the next level
            } else if (response.data.message === 'Correct answer') {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1); // Move to the next question
            }

            setSelectedAnswer('');
            setError('');
        } catch (err: any) {
            if (err.response?.status === 400 && err.response?.data?.message === 'Wrong answer. Redirecting to dashboard.') {
                navigate('/dashboard'); // Redirect to dashboard on wrong answer
            } else {
                console.error('Error submitting answer:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to submit answer. Please try again.');
            }
        }
    };

    const handleUseLifeline = async (lifelineType: string) => {
        try {
            const token = localStorage.getItem('token'); // Get token from localStorage
            const response = await api.post('/questions/lifeline', {
                lifelineType,
                questionId: questions[currentQuestionIndex]._id,
            }, {
                headers: { Authorization: `Bearer ${token}` }, // Add Authorization header
            });

            const { result } = response.data;
            if (lifelineType === '5050') {
                // Update the current question's options to only include the remaining options
                const updatedQuestions = [...questions];
                updatedQuestions[currentQuestionIndex].options = result;
                setQuestions(updatedQuestions);
            }
        } catch (err: any) {
            console.error('Error using lifeline:', err.response?.data || err.message);
            if (err.response?.data?.message === 'Lifeline already used') {
                setError('This lifeline has already been used.');
            } else {
                setError(err.response?.data?.message || 'Failed to use lifeline. Please try again.');
            }
        }
    };

    if (questions.length === 0) {
        return <p>Loading questions...</p>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
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
                <button onClick={() => handleUseLifeline('phoneAFriend')} style={styles.lifelineButton}>Phone a Friend</button>
                <button onClick={() => handleUseLifeline('audiencePoll')} style={styles.lifelineButton}>Audience Poll</button>
                <button onClick={() => handleUseLifeline('changeQuestion')} style={styles.lifelineButton}>Flip the Question</button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '50px auto',
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