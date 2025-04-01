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

interface AudiencePollResult {
    [option: string]: number;
}

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

const Particles = () => {
    useEffect(() => {
        const createParticles = () => {
            const particleCount = 20;
            const container = document.body;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';

                // Random position
                particle.style.left = `${Math.random() * 100}vw`;
                particle.style.top = `${Math.random() * 100}vh`;

                // Random size
                const size = Math.random() * 4 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;

                // Random animation delay
                particle.style.animationDelay = `${Math.random() * 15}s`;

                container.appendChild(particle);
            }
        };

        createParticles();

        // Cleanup function to remove particles when component unmounts
        return () => {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => particle.remove());
        };
    }, []);

    return null;
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
    const [isGameOver, setIsGameOver] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleMouseEnter = (e: React.MouseEvent<HTMLLabelElement>, option: string) => {
        if (option !== selectedAnswer && option !== correctAnswer) {
            e.currentTarget.style.backgroundColor = '#444488';
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLLabelElement>, option: string) => {
        if (option !== selectedAnswer && option !== correctAnswer) {
            e.currentTarget.style.backgroundColor = '#333366';
        }
    };

    const resetLifelines = async () => {
        try {
            const token = localStorage.getItem('token');
            await api.post('/questions/reset-lifelines', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsedLifelines({
                '5050': false,
                'audiencePoll': false,
                'changeQuestion': false,
                'showAnswer': false,
            });
        } catch (err: any) {
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
                    const randomIndex = Math.floor(Math.random() * response.data.length);
                    const question = response.data[randomIndex];
                    setCurrentQuestion(question);
                    setTimeLeft(question.timeLimit);
                } else {
                    if (currentLevel === 1) {
                        setError('No questions available. Please contact the administrator.');
                    } else {
                        alert("Congratulations! You've completed all levels!");
                        navigate('/dashboard');
                    }
                }
            } catch (err: any) {
                setError('Failed to load question. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [currentLevel, navigate]);

    useEffect(() => {
        if (currentQuestion && currentQuestion.level <= 10 && !isGameOver) {
            const tickingSound = new Audio('/sounds/tick.mp3');
            tickingSound.loop = true;

            const isUnlimitedTime = currentQuestion.timeLimit >= 999000;
            if (!isUnlimitedTime) {
                tickingSound.play().catch(() => {});

                const timer = setInterval(() => {
                    setTimeLeft((prevTime) => {
                        if (prevTime <= 1) {
                            clearInterval(timer);
                            tickingSound.pause();
                            setGameEndReason('Time is up!');
                            setFinalPrize(getPrizeForLevel(currentLevel - 1));
                            setShowEndGameModal(true);
                            setIsGameOver(true);
                        }
                        return prevTime - 1;
                    });
                }, 1000);

                return () => {
                    clearInterval(timer);
                    tickingSound.pause();
                };
            } else {
                setTimeLeft(Infinity);
            }
        }
    }, [currentQuestion, currentLevel, isGameOver]);

    useEffect(() => {
        setCurrentPrize(getPrizeForLevel(currentLevel));
    }, [currentLevel]);

    useEffect(() => {
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

        return () => {
            if (modalButton) {
                modalButton.removeEventListener('mouseenter', () => {});
                modalButton.removeEventListener('mouseleave', () => {});
            }
        };
    }, []);

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

            if (currentQuestion.level === 16) {
                setGameEndReason('Congratulations! You have won the grand prize!');
                setFinalPrize(getPrizeForLevel(16));
                setShowEndGameModal(true);
                setIsGameOver(true);
                return;
            }

            setCurrentLevel(currentQuestion.level + 1);
            setSelectedAnswer('');
            setError('');
        } catch (err: any) {
            if (err.response?.status === 400 && err.response?.data?.message === 'Wrong answer. Redirecting to dashboard.') {
                setGameEndReason('Sorry, that was the wrong answer.');
                if (currentLevel > 1) {
                    setFinalPrize(getPrizeForLevel(currentLevel - 1));
                } else {
                    setFinalPrize('0');
                }
                setShowEndGameModal(true);
                setIsGameOver(true);
            } else {
                setError(err.response?.data?.message || 'Failed to submit answer. Please try again.');
            }
        }
    };

    const handleUseLifeline = async (lifelineType: string) => {
        if (!currentQuestion) return;

        if (usedLifelines[lifelineType]) {
            setError('This lifeline has already been used.');
            return;
        }

        try {
            if (lifelineType === 'changeQuestion') {
                const token = localStorage.getItem('token');
                const getAllResponse = await api.get(`/questions?level=${currentLevel}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (getAllResponse.data && getAllResponse.data.length > 0) {
                    const otherQuestions = getAllResponse.data.filter(
                        (q: Question) => q._id !== currentQuestion._id
                    );

                    if (otherQuestions.length === 0) {
                        setError('No alternative questions available for this level.');
                        return;
                    }

                    const randomIndex = Math.floor(Math.random() * otherQuestions.length);
                    const newQuestion = otherQuestions[randomIndex];

                    setUsedLifelines(prev => ({
                        ...prev,
                        [lifelineType]: true
                    }));

                    setCurrentQuestion(newQuestion);
                    setTimeLeft(newQuestion.timeLimit);
                    setSelectedAnswer('');

                    await api.post('/questions/lifeline', {
                        lifelineType,
                        questionId: currentQuestion._id,
                    }, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    return;
                } else {
                    setError('No questions available for this level.');
                    return;
                }
            } else if (lifelineType === 'audiencePoll') {
                setUsedLifelines(prev => ({
                    ...prev,
                    [lifelineType]: true
                }));

                const correctAnswer = currentQuestion.correctAnswer;
                const options = currentQuestion.options;

                const correctPercentage = Math.floor(Math.random() * 36) + 50;
                const remainingPercentage = 100 - correctPercentage;

                const incorrectOptions = options.filter(option => option !== correctAnswer);

                const pollResults: AudiencePollResult = {};
                pollResults[correctAnswer] = correctPercentage;

                let remainingToDistribute = remainingPercentage;
                for (let i = 0; i < incorrectOptions.length; i++) {
                    const option = incorrectOptions[i];
                    if (i === incorrectOptions.length - 1) {
                        pollResults[option] = remainingToDistribute;
                    } else {
                        const maxForOption = Math.floor(remainingToDistribute / (incorrectOptions.length - i));
                        const percentage = Math.floor(Math.random() * maxForOption);
                        pollResults[option] = percentage;
                        remainingToDistribute -= percentage;
                    }
                }

                setAudiencePollResults(pollResults);

                const token = localStorage.getItem('token');
                await api.post('/questions/lifeline', {
                    lifelineType,
                    questionId: currentQuestion._id,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                return;
            } else {
                const token = localStorage.getItem('token');
                const response = await api.post('/questions/lifeline', {
                    lifelineType,
                    questionId: currentQuestion._id,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

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
                    setCorrectAnswer(result);
                    setSelectedAnswer(result);
                } else if (lifelineType === 'audiencePoll') {
                    setAudiencePollResults(result);
                }
            }
        } catch (err: any) {
            if (err.response?.data?.message === 'Lifeline already used') {
                setError('This lifeline has already been used.');
                setUsedLifelines(prev => ({
                    ...prev,
                    [lifelineType]: true
                }));
            } else if (err.response?.data?.message === 'No alternative questions available for this level.') {
                setError('No alternative questions available for this level.');
            } else {
                // setError('An error occurred. Please try again.');
            }
        }
    };

    useEffect(() => {
        console.log('Used lifelines updated:', usedLifelines);
    }, [usedLifelines]);

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
            <Particles />
            <div style={styles.container}>
                <p style={styles.timer} className="timer">
                    Time Left: {timeLeft === Infinity || timeLeft >= 999000 ? 'Unlimited' : `${timeLeft} seconds`}
                </p>
                <h1 style={styles.title}>Quiz</h1>
                <div style={styles.levelInfo}>
                    <p style={styles.level}>Level: {currentLevel}</p>
                    <p style={styles.prize}>Prize: ₹{currentPrize}</p>
                </div>
                <p style={styles.question}>{currentQuestion.questionText}</p>
                <div style={styles.optionsContainer} className="optionsContainer">
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
                                style={{ display: 'none' }}
                            />
                            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                            <span className="option-text">{option}</span>
                            {audiencePollResults && audiencePollResults[option] !== undefined && (
                                <div style={styles.pollContainer}>
                                    <div style={{
                                        ...styles.pollBar,
                                        width: `${audiencePollResults[option]}%`
                                    }}></div>
                                    <span style={styles.pollPercentage}>
                                        {audiencePollResults[option]}%
                                    </span>
                                </div>
                            )}
                        </label>
                    ))}
                </div>
                {error && <p style={styles.error}>{error}</p>}
                <button onClick={handleAnswerSubmit} style={styles.button}>
                    <span>Submit Answer</span>
                </button>
                <div style={styles.lifelineContainer} className="lifeline-container">
                    <button 
                        onClick={() => handleUseLifeline('5050')} 
                        style={usedLifelines['5050'] ? {...styles.lifelineButton, ...styles.disabledLifeline} : styles.lifelineButton}
                        disabled={usedLifelines['5050']}
                        className="lifeline-button"
                    >
                        <span className="lifeline-icon">50:50</span>
                        <span className="lifeline-text">Eliminate Two</span>
                    </button>
                    <button 
                        onClick={() => handleUseLifeline('audiencePoll')} 
                        style={usedLifelines['audiencePoll'] ? {...styles.lifelineButton, ...styles.disabledLifeline} : styles.lifelineButton}
                        disabled={usedLifelines['audiencePoll']}
                        className="lifeline-button"
                    >
                        <span className="lifeline-icon">👥</span>
                        <span className="lifeline-text">Audience Poll</span>
                    </button>
                    <button 
                        onClick={() => handleUseLifeline('changeQuestion')} 
                        style={usedLifelines['changeQuestion'] ? {...styles.lifelineButton, ...styles.disabledLifeline} : styles.lifelineButton}
                        disabled={usedLifelines['changeQuestion']}
                        className="lifeline-button"
                    >
                        <span className="lifeline-icon">🔄</span>
                        <span className="lifeline-text">Flip the Question</span>
                    </button>
                    <button 
                        onClick={() => handleUseLifeline('showAnswer')} 
                        style={usedLifelines['showAnswer'] ? {...styles.lifelineButton, ...styles.disabledLifeline} : styles.lifelineButton}
                        disabled={usedLifelines['showAnswer']}
                        className="lifeline-button"
                    >
                        <span className="lifeline-icon">💡</span>
                        <span className="lifeline-text">Expert's Advice</span>
                    </button>
                </div>
                
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
        width: '100%',
        minHeight: 'calc(100vh - 60px)',
        margin: '0',
        padding: '20px',
        maxWidth: '100vw',
        fontFamily: '"Montserrat", Arial, sans-serif',
        textAlign: 'center' as const,
        background: 'linear-gradient(135deg, #1a1a3d 0%, #0d0d2b 100%)',
        color: '#fff',
        position: 'relative' as const,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'flex-start',
        boxSizing: 'border-box' as const,
        paddingTop: '100px',  // Add padding at the top for better positioning
    },
    timer: {
        fontSize: '1.5rem',
        color: '#ffcc00',
        marginBottom: '20px',
        position: 'absolute' as const,
        top: '60px', // Changed from 15px to 60px to bring timer lower
        right: '20px',
        background: 'rgba(0,0,0,0.3)',
        padding: '5px 15px',
        borderRadius: '20px',
        fontWeight: 'bold' as const,
        boxShadow: '0 0 10px rgba(255, 204, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    title: {
        fontSize: '2.2rem',
        background: 'linear-gradient(to right, #ffcc00, #ff9d00)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '25px',
        marginTop: '0',  // Ensure title doesn't have extra top margin
        letterSpacing: '1px',
        textTransform: 'uppercase' as const,
        fontWeight: 'bold' as const,
    },
    levelInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '800px',  // Add max width for better readability
        marginBottom: '25px',
        padding: '10px 15px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
    level: {
        fontSize: '1.2rem',
        color: '#ccc',
        fontWeight: 'bold' as const,
    },
    prize: {
        fontSize: '1.2rem',
        color: '#ffcc00',
        fontWeight: 'bold' as const,
        textShadow: '0 0 5px rgba(255, 204, 0, 0.5)',
    },
    question: {
        fontSize: '1.3rem',
        marginBottom: '25px',
        padding: '20px',
        width: '100%',
        maxWidth: 'calc(100vw - 40px)',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
        lineHeight: '1.6',
        fontWeight: '500' as const,
        color: '#e6e6ff',
        boxSizing: 'border-box' as const,
        wordWrap: 'break-word' as const,
    },
    optionsContainer: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        justifyContent: 'center',
        marginBottom: '30px',
        width: '100%',
        maxWidth: 'calc(100vw - 40px)',
        boxSizing: 'border-box' as const,
    },
    option: {
        background: 'linear-gradient(135deg, #333366 0%, #252550 100%)',
        color: '#fff',
        padding: '15px 20px',
        borderRadius: '12px',
        cursor: 'pointer',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        fontSize: '1.1rem',
        textAlign: 'left' as const,
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        position: 'relative' as const,
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        height: '100%',
    },
    optionHover: {
        background: 'linear-gradient(135deg, #444488 0%, #333366 100%)',
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
    },
    selectedOption: {
        background: 'linear-gradient(135deg, #cc7722 0%, #aa5500 100%)',
        color: '#fff',
        fontWeight: 'bold' as const,
        border: '1px solid #ffcc00',
        boxShadow: '0 0 15px rgba(255, 204, 0, 0.3), 0 4px 15px rgba(0, 0, 0, 0.2)',
    },
    correctOption: {
        background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
        color: '#fff',
        fontWeight: 'bold' as const,
        border: '1px solid #5ef087',
        boxShadow: '0 0 20px rgba(40, 167, 69, 0.5), 0 4px 15px rgba(0, 0, 0, 0.2)',
    },
    pollContainer: {
        position: 'absolute' as const,
        bottom: '0',
        left: '0',
        width: '100%',
        height: '8px',
        background: 'rgba(0, 0, 0, 0.2)',
    },
    pollBar: {
        height: '100%',
        background: 'linear-gradient(to right, #ffcc00, #ff9d00)',
        transition: 'width 1s ease-out',
    },
    pollPercentage: {
        position: 'absolute' as const,
        right: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontWeight: 'bold' as const,
        color: '#ffcc00',
        fontSize: '0.6rem',
    },
    button: {
        padding: '12px 30px',
        fontSize: '1.1rem',
        color: '#fff',
        background: 'linear-gradient(135deg, #007BFF 0%, #0056b3 100%)',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        marginTop: '20px',
        fontWeight: 'bold' as const,
        transition: 'all 0.3s',
        boxShadow: '0 4px 15px rgba(0, 123, 255, 0.3)',
        position: 'relative' as const,
        overflow: 'hidden',
    },
    error: {
        color: '#ff5555',
        fontSize: '0.95rem',
        marginBottom: '20px',
        padding: '10px',
        background: 'rgba(255, 0, 0, 0.1)',
        borderRadius: '5px',
        border: '1px solid rgba(255, 0, 0, 0.2)',
    },
    lifelineContainer: {
        display: 'flex',
        justifyContent: 'center' as const,
        gap: '15px',
        marginTop: '30px',
        flexWrap: 'wrap' as const,
    },
    lifelineButton: {
        padding: '12px 15px',
        fontSize: '0.9rem',
        color: '#fff',
        background: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        width: '120px',
        height: '80px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    },
    disabledLifeline: {
        background: 'linear-gradient(135deg, #666666 0%, #444444 100%)',
        cursor: 'not-allowed',
        opacity: 0.6,
        boxShadow: 'none',
    },
    modalOverlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
    },
    modal: {
        background: 'linear-gradient(135deg, #1a1a3d 0%, #0d0d2b 100%)',
        padding: '40px',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '550px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 50px rgba(255, 204, 0, 0.15)',
        border: '2px solid #ffcc00',
        textAlign: 'center' as const,
        animation: 'fadeIn 0.7s ease',
        position: 'relative' as const,
        overflow: 'hidden',
    },
    modalTitle: {
        color: '#ffcc00',
        fontSize: '2rem',
        marginBottom: '25px',
        textShadow: '0 0 10px rgba(255, 204, 0, 0.3)',
    },
    modalText: {
        color: '#fff',
        fontSize: '1.2rem',
        marginBottom: '30px',
    },
    modalPrize: {
        color: '#ffcc00',
        fontSize: '3rem',
        fontWeight: 'bold' as const,
        display: 'block',
        margin: '20px 0',
        textShadow: '0 0 15px rgba(255, 204, 0, 0.5)',
    },
    modalButton: {
        backgroundColor: '#ffcc00',
        color: '#1a1a3d',
        border: 'none',
        padding: '15px 30px',
        borderRadius: '30px',
        fontSize: '1.2rem',
        fontWeight: 'bold' as const,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
    }
};

const addGlobalStyle = (css: string) => {
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
};

addGlobalStyle(`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
    
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        background: linear-gradient(135deg, #1a1a3d 0%, #0d0d2b 100%);
    }
    
    body {
        position: relative;
    }
    
    body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0,
        width: 100%;
        height: 100%;
        background: 
            radial-gradient(circle at 10% 20%, rgba(90, 90, 255, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(90, 90, 255, 0.05) 0%, transparent 40%),
            linear-gradient(135deg, #1a1a3d 0%, #0d0d2b 100%);
        z-index: -1;
    }
    
    #root {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        overflow-x: hidden;
    }
    
    * {
        box-sizing: border-box;
    }
    
    /* Media queries for responsive layout */
    @media screen and (max-width: 768px) {
        .optionsContainer {
            grid-template-columns: 1fr !important;
        }
        
        .option-letter {
            width: 24px;
            height: 24px;
            font-size: 0.9rem;
        }
        
        .lifeline-icon {
            font-size: 1.2rem;
        }
        
        .lifeline-text {
            font-size: 0.7rem;
        }
        
        /* Adjust padding for smaller screens */
        #root > div {
            padding-top: 80px !important;
        }
    }
    
    @media screen and (max-width: 480px) {
        #root {
            padding: 0;
        }
        
        /* Adjust padding for very small screens */
        #root > div {
            padding-top: 70px !important;
        }
        
        .timer {
            top: 45px !important; /* Adjusted from 5px to 45px to match the lowered position */
            right: 5px !important;
            font-size: 1.2rem !important;
            padding: 5px 10px !important;
        }
        
        .lifeline-container {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px !important;
        }
        
        .lifeline-button {
            width: calc(50% - 5px) !important;
            height: 70px !important;
            padding: 8px !important;
        }
    }
    
    /* Prevent particle overflow */
    .particle {
        position: fixed;
        width: 5px;
        height: 5px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        pointer-events: none;
        animation: floatingParticles 15s infinite linear;
        z-index: 0;
    }
    
    /* Other existing animations */
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(255, 204, 0, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0); }
    }
    
    @keyframes glow {
        0% { box-shadow: 0 0 5px rgba(255, 204, 0, 0.3); }
        50% { box-shadow: 0 0 20px rgba(255, 204, 0, 0.5); }
        100% { box-shadow: 0 0 5px rgba(255, 204, 0, 0.3); }
    }
    
    @keyframes floatingParticles {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        50% { opacity: 0.5; }
        100% { transform: translateY(-100vh) rotate(720deg); opacity: 0; }
    }
    
    /* Apply custom classes to elements for responsive control */
    .option-letter {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background: rgba(255,255,255,0.1);
        margin-right: 15px;
        border-radius: 50%;
        font-weight: bold;
        flex-shrink: 0;
    }
    
    .option-text {
        flex-grow: 1;
        word-break: break-word;
        hyphens: auto;
    }
    
    button:hover:not(:disabled) {
        transform: translateY(-3px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }
    
    button:active:not(:disabled) {
        transform: translateY(-1px);
    }
    
    .lifeline-icon {
        font-size: 1.5rem;
        margin-bottom: 5px;
    }
    
    .lifeline-text {
        font-size: 0.8rem;
        opacity: 0.9;
    }
`);

export default StartQuiz;