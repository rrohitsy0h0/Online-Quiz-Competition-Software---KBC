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

// New interface for audience poll results
interface AudiencePollResult {
    [option: string]: number; // Maps each option to its percentage
}

// Function to get prize for level needs to be defined outside the components/hooks
const getPrizeForLevel = (level: number): string => {
    const prizeMoney = {
        0: '0',
        1: '1,000',
        2: '2,000',
        3: '3,000',
        4: '5,000',
        5: '10,000',
        6: '20,000',
        7: '40,000',
        8: '80,000',
        9: '1,60,000',
        10: '3,20,000',
        11: '6,40,000',
        12: '12,50,000',
        13: '25,00,000',
        14: '50,00,000',
        15: '75,00,000',
        16: '1,00,00,000'
    };
    return prizeMoney[level as keyof typeof prizeMoney] || '0';
};

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
    const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
    const [audiencePollResults, setAudiencePollResults] = useState<AudiencePollResult | null>(null);
    const [currentPrize, setCurrentPrize] = useState<string>('');
    const [showEndGameModal, setShowEndGameModal] = useState<boolean>(false);
    const [finalPrize, setFinalPrize] = useState<string>('0');
    const [gameEndReason, setGameEndReason] = useState<string>('');
    const navigate = useNavigate();

    // Update the mouse event handlers to account for selected and correct options
    const handleMouseEnter = (e: React.MouseEvent<HTMLLabelElement>, option: string) => {
        // Only change background if this option isn't selected or correct
        if (option !== selectedAnswer && option !== correctAnswer) {
            e.currentTarget.style.backgroundColor = '#444488'; // Hover background
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLLabelElement>, option: string) => {
        // Only reset background if this option isn't selected or correct
        if (option !== selectedAnswer && option !== correctAnswer) {
            e.currentTarget.style.backgroundColor = '#333366'; // Default background
        }
    };

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
                            setGameEndReason('Time is up!');
                            setFinalPrize(getPrizeForLevel(currentLevel - 1)); // Previous level prize
                            setShowEndGameModal(true);
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
    }, [currentQuestion, currentLevel]); // Remove navigate from dependencies, add currentLevel

    useEffect(() => {
        // Update the prize money based on current level
        setCurrentPrize(getPrizeForLevel(currentLevel));
    }, [currentLevel]);

    useEffect(() => {
        // Add hover effect for modal button
        const modalButton = document.querySelector('button[style*="modalButton"]');
        if (modalButton) {
            modalButton.addEventListener('mouseenter', (e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = '#ffd700';
                target.style.transform = 'translateY(-2px)';
                target.style.boxShadow = '0 6px 15px rgba(255, 204, 0, 0.4)';
            });
            
            modalButton.addEventListener('mouseleave', (e) => {
                const target = e.currentTarget as HTMLElement;
                target.style.backgroundColor = '#ffcc00';
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = 'none';
            });
        }

        // Cleanup event listeners on unmount
        return () => {
            if (modalButton) {
                modalButton.removeEventListener('mouseenter', () => {});
                modalButton.removeEventListener('mouseleave', () => {});
            }
        };
    }, []); // Empty dependency array means this runs once after first render

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
            
            // If we've completed the final level, show the winning modal
            if (currentQuestion.level === 16) {
                setGameEndReason('Congratulations! You have won the grand prize!');
                setFinalPrize(getPrizeForLevel(16));
                setShowEndGameModal(true);
                return;
            }
            
            // Otherwise continue to the next level
            setCurrentLevel(currentQuestion.level + 1);
            setSelectedAnswer('');
            setError('');
        } catch (err: any) {
            if (err.response?.status === 400 && err.response?.data?.message === 'Wrong answer. Redirecting to dashboard.') {
                // Show the end game modal with the amount won
                setGameEndReason('Sorry, that was the wrong answer.');
                
                // If they got at least one question right, they get the prize from the previous level
                if (currentLevel > 1) {
                    setFinalPrize(getPrizeForLevel(currentLevel - 1));
                } else {
                    setFinalPrize('0');
                }
                
                setShowEndGameModal(true);
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
            } else if (lifelineType === 'audiencePoll') {
                // Mark the lifeline as used
                setUsedLifelines(prev => ({
                    ...prev,
                    [lifelineType]: true
                }));

                // Generate audience poll results on client side if not receiving from backend
                const correctAnswer = currentQuestion.correctAnswer;
                const options = currentQuestion.options;
                
                // Generate a random percentage for the correct answer (between 50% and 85%)
                const correctPercentage = Math.floor(Math.random() * 36) + 50;
                
                // Calculate the remaining percentage to distribute
                const remainingPercentage = 100 - correctPercentage;
                
                // Get the incorrect options
                const incorrectOptions = options.filter(option => option !== correctAnswer);
                
                // Initialize results object
                const pollResults: AudiencePollResult = {};
                
                // Set the correct answer percentage
                pollResults[correctAnswer] = correctPercentage;
                
                // Distribute remaining percentage among incorrect options
                let remainingToDistribute = remainingPercentage;
                for (let i = 0; i < incorrectOptions.length; i++) {
                    const option = incorrectOptions[i];
                    if (i === incorrectOptions.length - 1) {
                        // Last option gets all remaining percentage
                        pollResults[option] = remainingToDistribute;
                    } else {
                        // Calculate a random percentage for this option
                        const maxForOption = Math.floor(remainingToDistribute / (incorrectOptions.length - i));
                        const percentage = Math.floor(Math.random() * maxForOption);
                        pollResults[option] = percentage;
                        remainingToDistribute -= percentage;
                    }
                }
                
                console.log("Client-generated audience poll results:", pollResults);
                setAudiencePollResults(pollResults);
                
                // Still call the API to mark the lifeline as used on the server
                const token = localStorage.getItem('token');
                await api.post('/questions/lifeline', {
                    lifelineType,
                    questionId: currentQuestion._id,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                return;
            } else {
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
                    // Set the correct answer as highlighted AND selected
                    setCorrectAnswer(result);
                    setSelectedAnswer(result); // Automatically select the correct answer
                } else if (lifelineType === 'audiencePoll') {
                    // Use the server results if they're provided
                    setAudiencePollResults(result);
                }
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

    // Modal close handler
    const handleCloseModal = () => {
        setShowEndGameModal(false);
        navigate('/dashboard');
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
                <p style={styles.timer}>
                    Time Left: {timeLeft === Infinity || timeLeft >= 999000 ? 'Unlimited' : `${timeLeft} seconds`}
                </p>
                <h1 style={styles.title}>Quiz</h1>
                <div style={styles.levelInfo}>
                    <p style={styles.level}>Level: {currentLevel}</p>
                    <p style={styles.prize}>Prize: ₹{currentPrize}</p>
                </div>
                <p style={styles.question}>{currentQuestion.questionText}</p>
                <div style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <label
                            key={index}
                            style={{
                                ...styles.option,
                                ...(selectedAnswer === option ? styles.selectedOption : {}),
                                ...(correctAnswer === option ? styles.correctOption : {}),
                            }}
                            onMouseEnter={(e) => handleMouseEnter(e, option)}
                            onMouseLeave={(e) => handleMouseLeave(e, option)}
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
                            {audiencePollResults && audiencePollResults[option] !== undefined && (
                                <span style={styles.pollPercentage}>
                                    {' '}{audiencePollResults[option]}%
                                </span>
                            )}
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
                        Expert's Advice
                    </button>
                </div>
                
                {/* End Game Modal */}
                {showEndGameModal && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h2 style={styles.modalTitle}>{gameEndReason}</h2>
                            <p style={styles.modalText}>
                                You won: <span style={styles.modalPrize}>₹{finalPrize}</span>
                            </p>
                            <button onClick={handleCloseModal} style={styles.modalButton}>
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                )}
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
    levelInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '15px',
    },
    level: {
        fontSize: '1.2rem',
        color: '#ccc',
    },
    prize: {
        fontSize: '1.2rem',
        color: '#ffcc00',
        fontWeight: 'bold' as const,
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
    correctOption: {
        backgroundColor: '#28a745', // Green for correct answer
        color: '#fff',
        fontWeight: 'bold' as const,
        border: '2px solid #1e7e34', // Darker green border
        boxShadow: '0 0 10px rgba(40, 167, 69, 0.7)', // Glow effect
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center' as const,
        transition: 'background-color 0.3s',
    },
    pollPercentage: {
        marginLeft: '10px',
        fontWeight: 'bold' as const,
        color: '#ffcc00', // Yellow color for poll percentages
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
    modalOverlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: 'rgba(26, 26, 61, 0.95)',
        padding: '30px',
        borderRadius: '15px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        border: '2px solid #ffcc00',
        textAlign: 'center' as const,
        animation: 'fadeIn 0.5s ease',
    },
    modalTitle: {
        color: '#ffcc00',
        fontSize: '1.8rem',
        marginBottom: '20px',
    },
    modalText: {
        color: '#fff',
        fontSize: '1.2rem',
        marginBottom: '30px',
    },
    modalPrize: {
        color: '#ffcc00',
        fontSize: '2.5rem',
        fontWeight: 'bold' as const,
        display: 'block',
        margin: '15px 0',
    },
    modalButton: {
        backgroundColor: '#ffcc00',
        color: '#1a1a3d',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '1.1rem',
        fontWeight: 'bold' as const,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    }
};

// Add animation for the modal
const addGlobalStyle = (css: string) => {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
};

addGlobalStyle(`
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`);

export default StartQuiz;