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
            setTimeLeft(45); // Reset time limit for each question
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
            const token = localStorage.getItem('token'); // Get token from localStorage
            console.log('Token:', token); // Debugging log
            const currentQuestion = questions[currentQuestionIndex];
            console.log('Submitting Answer:', selectedAnswer); // Debugging log
            const response = await api.post('/questions/answer', {
                questionId: currentQuestion._id,
                answer: selectedAnswer,
            }, {
                headers: { Authorization: `Bearer ${token}` }, // Ensure token is included
            });

            if (response.data.message === 'Correct answer') {
                // If the answer is correct and there are no more questions in the current level
                if (currentQuestionIndex + 1 >= questions.length) {
                    if (currentLevel < 5) { // Assuming there are 5 levels
                        alert(`Level ${currentLevel} completed! Proceeding to Level ${currentLevel + 1}.`);
                        setCurrentLevel(currentLevel + 1); // Increment level
                        setSelectedAnswer('');
                        setError('');
                    } else {
                        alert('Congratulations! You have completed all levels of the quiz.');
                        navigate('/dashboard'); // Redirect to dashboard after completing all levels
                    }
                } else {
                    // Move to the next question in the current level
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setSelectedAnswer('');
                    setError('');
                }
            } else {
                // If the answer is wrong, end the quiz
                alert('Wrong answer. Game over.');
                navigate('/dashboard'); // Redirect to dashboard on wrong answer
            }
        } catch (err: any) {
            console.error('Error submitting answer:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to submit answer. Please try again.');
        }
    };

    if (questions.length === 0) {
        return <p>Loading questions...</p>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Quiz</h1>
            <p style={styles.level}>Level: {currentLevel}</p>
            <p style={styles.timer}>Time Left: {timeLeft} seconds</p>
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
    timer: {
        position: 'absolute' as const,
        bottom: '10px',
        right: '10px',
        fontSize: '1.2rem',
        color: 'red',
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
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
        marginBottom: '20px',
    },
};

export default StartQuiz;
