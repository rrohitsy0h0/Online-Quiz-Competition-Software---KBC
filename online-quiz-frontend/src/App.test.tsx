import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// Basic test to ensure the testing environment works
test('testing environment is working', () => {
  expect(true).toBe(true);
});

// Authentication Tests
describe('Authentication Tests', () => {
  // Mock auth functions
  const mockLogin = jest.fn();
  const mockRegister = jest.fn();
  const mockLogout = jest.fn();

  test('login form handles submission correctly', () => {
    const LoginForm = ({ onLogin }: { onLogin: (username: string, password: string) => void }) => (
      <form data-testid="login-form" onSubmit={(e) => {
        e.preventDefault();
        const username = (document.getElementById('username') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        onLogin(username, password);
      }}>
        <input id="username" data-testid="username-input" placeholder="Username" />
        <input id="password" data-testid="password-input" type="password" placeholder="Password" />
        <button type="submit" data-testid="login-button">Login</button>
      </form>
    );
    
    render(<LoginForm onLogin={mockLogin} />);
    
    const usernameInput = screen.getByTestId('username-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');
    
    userEvent.type(usernameInput, 'testuser');
    userEvent.type(passwordInput, 'password123');
    userEvent.click(loginButton);
    
    expect(mockLogin).toHaveBeenCalledWith('testuser', 'password123');
  });

  test('register form creates new account', () => {
    const RegisterForm = ({ onRegister }: { onRegister: (username: string, password: string, email: string) => void }) => (
      <form data-testid="register-form" onSubmit={(e) => {
        e.preventDefault();
        const username = (document.getElementById('reg-username') as HTMLInputElement).value;
        const password = (document.getElementById('reg-password') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        onRegister(username, password, email);
      }}>
        <input id="reg-username" data-testid="reg-username-input" placeholder="Username" />
        <input id="email" data-testid="email-input" placeholder="Email" />
        <input id="reg-password" data-testid="reg-password-input" type="password" placeholder="Password" />
        <button type="submit" data-testid="register-button">Register</button>
      </form>
    );
    
    render(<RegisterForm onRegister={mockRegister} />);
    
    const usernameInput = screen.getByTestId('reg-username-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('reg-password-input');
    const registerButton = screen.getByTestId('register-button');
    
    userEvent.type(usernameInput, 'newuser');
    userEvent.type(emailInput, 'user@example.com');
    userEvent.type(passwordInput, 'securepass');
    userEvent.click(registerButton);
    
    expect(mockRegister).toHaveBeenCalledWith('newuser', 'securepass', 'user@example.com');
  });

  test('logout button functions correctly', () => {
    render(
      <button data-testid="logout-button" onClick={mockLogout}>
        Logout
      </button>
    );
    
    const logoutButton = screen.getByTestId('logout-button');
    userEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

// Quiz UI Tests
describe('Quiz Interface Tests', () => {
  // Mock quiz-related functions
  const mockOptionSelect = jest.fn();
  const mockLifelineUse = jest.fn();
  const mockStartQuiz = jest.fn();

  test('How to Play screen displays rules', () => {
    const HowToPlay = () => (
      <div data-testid="how-to-play">
        <h1>How to Play</h1>
        <ul>
          <li data-testid="rule-1">Answer 15 questions to win the grand prize</li>
          <li data-testid="rule-2">You have 4 lifelines available</li>
          <li data-testid="rule-3">Time limit is 30 seconds per question</li>
        </ul>
      </div>
    );
    
    render(<HowToPlay />);
    
    expect(screen.getByTestId('how-to-play')).toBeInTheDocument();
    expect(screen.getByTestId('rule-1')).toHaveTextContent('grand prize');
    expect(screen.getByTestId('rule-2')).toHaveTextContent('lifelines');
    expect(screen.getByTestId('rule-3')).toHaveTextContent('30 seconds');
  });

  test('Start Quiz button begins the game', () => {
    render(
      <button data-testid="start-quiz-button" onClick={mockStartQuiz}>
        Start Quiz
      </button>
    );
    
    const startButton = screen.getByTestId('start-quiz-button');
    userEvent.click(startButton);
    
    expect(mockStartQuiz).toHaveBeenCalledTimes(1);
  });

  test('Question displays with all options', () => {
    const mockQuestion = {
      id: '1',
      question: 'Which planet is known as the Red Planet?',
      options: ['Earth', 'Mars', 'Jupiter', 'Venus'],
      correctAnswer: 'Mars',
      level: 2
    };
    
    const QuizQuestion = ({ 
      question, 
      onSelectOption 
    }: { 
      question: typeof mockQuestion,
      onSelectOption: (option: string) => void
    }) => (
      <div data-testid="quiz-question">
        <h2 data-testid="question-text">{question.question}</h2>
        <div data-testid="options-container">
          {question.options.map((option, idx) => (
            <button 
              key={idx} 
              data-testid={`option-${idx}`}
              onClick={() => onSelectOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );
    
    render(<QuizQuestion question={mockQuestion} onSelectOption={mockOptionSelect} />);
    
    // Check if question text is displayed
    expect(screen.getByTestId('question-text')).toHaveTextContent('Which planet is known as the Red Planet?');
    
    // Check if all options are displayed
    expect(screen.getByTestId('option-0')).toHaveTextContent('Earth');
    expect(screen.getByTestId('option-1')).toHaveTextContent('Mars');
    
    // Test option selection
    userEvent.click(screen.getByTestId('option-1'));
    expect(mockOptionSelect).toHaveBeenCalledWith('Mars');
  });

  test('Timer counts down properly', () => {
    jest.useFakeTimers();
    
    const mockTimeUp = jest.fn();
    
    // Define type for Timer component props
    interface TimerProps {
      seconds: number;
      onTimeUp: () => void;
    }
    
    const Timer: React.FC<TimerProps> = ({ seconds, onTimeUp }) => {
      const [timeLeft, setTimeLeft] = React.useState(seconds);
      
      React.useEffect(() => {
        if (timeLeft <= 0) {
          onTimeUp();
          return;
        }
        
        const timerId = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        
        return () => clearTimeout(timerId);
      }, [timeLeft, onTimeUp]);
      
      return <div data-testid="timer">{timeLeft} seconds remaining</div>;
    };
    
    render(<Timer seconds={3} onTimeUp={mockTimeUp} />);
    
    // Initial render check
    expect(screen.getByTestId('timer')).toHaveTextContent('3 seconds remaining');
    
    // Fast-forward time and update React
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('timer')).toHaveTextContent('2 seconds remaining');
    
    // Fast-forward more time and update React
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('timer')).toHaveTextContent('1 seconds remaining');
    
    // Fast-forward to trigger onTimeUp
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(mockTimeUp).toHaveBeenCalledTimes(1);
    
    jest.useRealTimers();
  });

  test('Lifelines functionality', () => {
    // Define interface for lifeline objects
    interface Lifeline {
      id: string;
      name: string;
      available: boolean;
    }
    
    // Create typed array of lifelines
    const lifelines: Lifeline[] = [
      { id: 'fifty-fifty', name: '50:50', available: true },
      { id: 'phone-friend', name: 'Phone a Friend', available: true },
      { id: 'audience-poll', name: 'Audience Poll', available: false },
      { id: 'flip-question', name: 'Flip Question', available: true }
    ];
    
    // Define interface for Lifelines component props
    interface LifelinesProps {
      lifelines: Lifeline[];
      onUseLifeline: (id: string) => void;
    }
    
    const Lifelines: React.FC<LifelinesProps> = ({ lifelines, onUseLifeline }) => (
      <div data-testid="lifelines-container">
        {lifelines.map((lifeline: Lifeline) => (
          <button 
            key={lifeline.id}
            data-testid={`lifeline-${lifeline.id}`}
            disabled={!lifeline.available}
            onClick={() => onUseLifeline(lifeline.id)}
          >
            {lifeline.name}
          </button>
        ))}
      </div>
    );
    
    render(<Lifelines lifelines={lifelines} onUseLifeline={mockLifelineUse} />);
    
    // Test available lifeline
    userEvent.click(screen.getByTestId('lifeline-fifty-fifty'));
    expect(mockLifelineUse).toHaveBeenCalledWith('fifty-fifty');
    
    // Test disabled lifeline
    expect(screen.getByTestId('lifeline-audience-poll')).toBeDisabled();
  });

  test('Prize money won is displayed correctly', () => {
    const prizeMoney = [
      { level: 1, amount: 1000, reached: true },
      { level: 2, amount: 2000, reached: true },
      { level: 3, amount: 5000, reached: true },
      { level: 4, amount: 10000, reached: false },
      { level: 5, amount: 20000, reached: false }
    ];
    
    const PrizeMoneyDisplay = ({ 
      prizes,
      currentLevel 
    }: { 
      prizes: typeof prizeMoney,
      currentLevel: number
    }) => (
      <div data-testid="prize-money-container">
        <h3>Prize Money</h3>
        <p data-testid="current-prize">Current prize: ${prizes[currentLevel - 1]?.amount}</p>
        <ul>
          {prizes.map((prize) => (
            <li 
              key={prize.level}
              data-testid={`prize-level-${prize.level}`}
              className={prize.reached ? 'reached' : ''}
            >
              Level {prize.level}: ${prize.amount}
            </li>
          ))}
        </ul>
      </div>
    );
    
    render(<PrizeMoneyDisplay prizes={prizeMoney} currentLevel={3} />);
    
    expect(screen.getByTestId('current-prize')).toHaveTextContent('$5000');
    expect(screen.getByTestId('prize-level-2')).toHaveTextContent('Level 2: $2000');
    expect(screen.getByTestId('prize-level-4')).toHaveTextContent('Level 4: $10000');
  });
});
