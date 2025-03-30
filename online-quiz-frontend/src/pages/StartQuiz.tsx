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
    const [usedLifelines, setUsedLifelines] = useState<Record<string, boolean>>({
        '5050': false,
        'audiencePoll': false,
        'changeQuestion': false,
        'showAnswer': false,
    });
    const navigate = useNavigate();

    const resetLifelines = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.post('/questions/reset-lifelines', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Lifelines reset successfully');
            
            // Reset local lifeline state
            setUsedLifelines({
                '5050': false,
                'audiencePoll': false,
                'changeQuestion': false,
                'showAnswer': false,
            });
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
                    // No questions found for this level
                    console.log(`No questions found for level ${currentLevel}`);
                    
                    // If we're at level 1 and no questions found, show error
                    if (currentLevel === 1) {
                        setError('No questions available. Please contact the administrator.');
                    } else {
                        // Otherwise, we've completed all levels
                        alert("Congratulations! You've completed all levels!");
                        navigate('/dashboard');
                    }
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
        if (currentQuestion && currentQuestion.level <= 10) {
            const tickingSound = new Audio('/sounds/tick.mp3'); // Path to the ticking sound file
            tickingSound.loop = true; // Loop the sound

            const isUnlimitedTime = currentQuestion.timeLimit >= 999000;
            if (!isUnlimitedTime) {
                tickingSound.play().catch((err) => console.error('Error playing ticking sound:', err));

                const timer = setInterval(() => {
                    setTimeLeft((prevTime) => {
                        if (prevTime <= 1) {
                            clearInterval(timer);
                            tickingSound.pause(); // Stop the ticking sound
                            alert('Time is up! Game over.');
                            navigate('/dashboard');
                        }
                        return prevTime - 1;
                    });
                }, 1000);

                return () => {
                    clearInterval(timer);
                    tickingSound.pause(); // Stop the ticking sound when the component unmounts
                };
            } else {
                setTimeLeft(Infinity);
            }
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
        
        // Check if the lifeline has already been used
        if (usedLifelines[lifelineType]) {
            setError('This lifeline has already been used.');
            return;
        }

        try {
            console.log(`Using lifeline: ${lifelineType} for question ID: ${currentQuestion._id}`);
            
            // Special case for "changeQuestion" - directly fetch a new question
            if (lifelineType === 'changeQuestion') {
                // Fetch all questions for the current level
                const token = localStorage.getItem('token');
                const getAllResponse = await api.get(`/questions?level=${currentLevel}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (getAllResponse.data && getAllResponse.data.length > 0) {
                    // Filter out the current question
                    const otherQuestions = getAllResponse.data.filter(
                        (q: Question) => q._id !== currentQuestion._id
                    );
                    
                    if (otherQuestions.length === 0) {
                        setError('No alternative questions available for this level.');
                        return;
                    }
                    
                    // Select a random question from available alternatives
                    const randomIndex = Math.floor(Math.random() * otherQuestions.length);
                    const newQuestion = otherQuestions[randomIndex];
                    
                    console.log('Changing to new question:', newQuestion);
                    
                    // IMPORTANT: Mark the lifeline as used BEFORE changing the question
                    // This ensures the state update happens before UI re-renders
                    setUsedLifelines(prev => ({
                        ...prev,
                        [lifelineType]: true
                    }));
                    
                    // Now update the question
                    setCurrentQuestion(newQuestion);
                    setTimeLeft(newQuestion.timeLimit);
                    setSelectedAnswer('');
                    
                    // Mark lifeline as used on the server
                    await api.post('/questions/lifeline', {
                        lifelineType,
                        questionId: currentQuestion._id, // Send original question ID
                    }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    
                    console.log(`Lifeline ${lifelineType} marked as used:`, true);
                    return;
                } else {
                    setError('No questions available for this level.');
                    return;
                }
            }
            
            // For other lifelines, use the normal approach
            const token = localStorage.getItem('token');
            const response = await api.post('/questions/lifeline', {
                lifelineType,
                questionId: currentQuestion._id,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log('Lifeline response:', response.data);
            
            // IMPORTANT: Mark the lifeline as used BEFORE updating UI
            setUsedLifelines(prev => ({
                ...prev,
                [lifelineType]: true
            }));

            const { result } = response.data;
            if (lifelineType === '5050') {
                setCurrentQuestion({
                    ...currentQuestion,
                    options: result
                });
            } else if (lifelineType === 'showAnswer') {
                alert(`The correct answer is: ${result}`);
            }
            
            console.log('Used lifelines after update:', {...usedLifelines, [lifelineType]: true});
        } catch (err: any) {
            console.error('Error details:', err.response?.data);
            
            // Filter certain error messages that we don't want to show to the user
            if (err.response?.data?.message === 'Lifeline already used') {
                setError('This lifeline has already been used.');
                
                // Update local state to reflect this lifeline is used
                setUsedLifelines(prev => ({
                    ...prev,
                    [lifelineType]: true
                }));
            } else if (err.response?.data?.message === 'No alternative questions available for this level.') {
                setError('No alternative questions available for this level.');
            } else if (err.response?.data?.message === 'Invalid lifeline type') {
                // Don't show this error to the user, just log it
                console.log('Server reported invalid lifeline type');
            } else {
                // Generic error message for other errors
                setError('An error occurred. Please try again.');
            }
        }
    };

    // Add debugging to see if usedLifelines is updating correctly
    useEffect(() => {
        console.log('Used lifelines updated:', usedLifelines);
    }, [usedLifelines]);

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
                <p style={styles.timer}>
                    Time Left: {timeLeft === Infinity || timeLeft >= 999000 ? 'Unlimited' : `${timeLeft} seconds`}
                </p>
                <h1 style={styles.title}>Quiz</h1>
                <p style={styles.level}>Level: {currentLevel}</p>
                <p style={styles.question}>{currentQuestion.questionText}</p>
                <div style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <label
                            key={index}
                            style={{
                                ...styles.option,
                                ...(selectedAnswer === option ? styles.selectedOption : {}),
                            }}
                        >
                            <input
                                type="radio"
                                name="answer"
                                value={option}
                                checked={selectedAnswer === option}
                                onChange={(e) => setSelectedAnswer(e.target.value)}
                                style={{ display: 'none' }} // Hide the radio button
                            />
                            {option}
                        </label>
                    ))}
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button onClick={handleAnswerSubmit} style={styles.button}>Submit Answer</button>
                <div style={styles.lifelineContainer}>
                    <button 
                        onClick={() => handleUseLifeline('5050')} 
                        style={usedLifelines['5050'] ? {...styles.lifelineButton, ...styles.disabledLifeline} : styles.lifelineButton}
                        disabled={usedLifelines['5050']}
                    >
                        50:50
                    </button>
                    <button 
                        onClick={() => handleUseLifeline('audiencePoll')} 
                        style={usedLifelines['audiencePoll'] ? {...styles.lifelineButton, ...styles.disabledLifeline} : styles.lifelineButton}
                        disabled={usedLifelines['audiencePoll']}
                    >
                        Audience Poll
                    </button>
                    <button 
                        onClick={() => handleUseLifeline('changeQuestion')} 
                        style={usedLifelines['changeQuestion'] ? {...styles.lifelineButton, ...styles.disabledLifeline} : styles.lifelineButton}
                        disabled={usedLifelines['changeQuestion']}
                    >
                        Flip the Question
                    </button>
                    <button 
                        onClick={() => handleUseLifeline('showAnswer')} 
                        style={usedLifelines['showAnswer'] ? {...styles.lifelineButton, ...styles.disabledLifeline} : styles.lifelineButton}
                        disabled={usedLifelines['showAnswer']}
                    >
                        Show Answer
                    </button>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '100px auto 50px',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center' as const,
        backgroundColor: '#1a1a3d', // Dark violet background
        color: '#fff', // White text
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative' as const, // Ensure positioning for timer
    },
    timer: {
        fontSize: '1.5rem',
        color: '#ffcc00', // Yellow for timer
        marginBottom: '20px',
        position: 'absolute' as const,
        top: '10px',
        right: '10px',
    },
    title: {
        fontSize: '2rem',
        color: '#ffcc00', // Yellow for title
        marginBottom: '20px',
    },
    level: {
        fontSize: '1.2rem',
        color: '#555',
        marginBottom: '10px',
    },
    question: {
        fontSize: '1.2rem',
        marginBottom: '20px',
    },
    optionsContainer: {
        display: 'grid', // Use grid layout
        gridTemplateColumns: '1fr 1fr', // Two columns
        gap: '15px',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    option: {
        backgroundColor: '#333366', // Dark blue for options
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        fontSize: '1rem',
        textAlign: 'center' as const,
        transition: 'background-color 0.3s',
    },
    optionHover: {
        backgroundColor: '#444488', // Slightly lighter blue on hover
    },
    selectedOption: {
        backgroundColor: '#cc7722', // Yellow ochre for selected option
        color: '#fff',
        fontWeight: 'bold' as const,
        border: '2px solid #a65e2e', // Slightly darker border for emphasis
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center' as const,
        transition: 'background-color 0.3s',
    },
    button: {
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
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
    disabledLifeline: {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed',
        opacity: 0.6,
    },
};

// Add hover effect for options
const handleMouseEnter = (e: React.MouseEvent<HTMLLabelElement>) => {
    (e.target as HTMLElement).style.backgroundColor = styles.optionHover.backgroundColor!;
};

const handleMouseLeave = (e: React.MouseEvent<HTMLLabelElement>) => {
    (e.target as HTMLElement).style.backgroundColor = styles.option.backgroundColor!;
};

export default StartQuiz;