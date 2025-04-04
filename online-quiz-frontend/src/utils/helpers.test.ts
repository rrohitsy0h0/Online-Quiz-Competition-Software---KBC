// Add an export to make this a module
export {};

// Utility functions to test
const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Quiz-specific utility functions
const calculateScore = (level: number, timeLeft: number): number => {
  const baseScore = level * 1000;
  const timeBonus = Math.floor(timeLeft / 10) * 100;
  return baseScore + timeBonus;
};

const getRandomIndex = (max: number): number => {
  return Math.floor(Math.random() * max);
};

const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// Get two random options for fifty-fifty lifeline, ensuring one is the correct answer
const getFiftyFiftyOptions = (options: string[], correctAnswer: string): string[] => {
  const result: string[] = [correctAnswer];
  const incorrectOptions = options.filter(option => option !== correctAnswer);
  const randomIndex = getRandomIndex(incorrectOptions.length);
  result.push(incorrectOptions[randomIndex]);
  return shuffleArray(result);
};

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    test('formats numbers as Indian currency', () => {
      expect(formatCurrency(1000)).toBe('₹1,000');
      expect(formatCurrency(100000)).toBe('₹100,000');
      expect(formatCurrency(1000000)).toBe('₹1,000,000');
    });
    
    test('handles zero and decimals', () => {
      expect(formatCurrency(0)).toBe('₹0');
      expect(formatCurrency(1000.50)).toBe('₹1,000.5');
    });
  });

  describe('formatTime', () => {
    test('formats seconds into minutes and seconds', () => {
      expect(formatTime(30)).toBe('0:30');
      expect(formatTime(65)).toBe('1:05');
      expect(formatTime(3600)).toBe('60:00');
    });
    
    test('adds leading zero for seconds less than 10', () => {
      expect(formatTime(61)).toBe('1:01');
      expect(formatTime(70)).toBe('1:10');
    });
  });

  describe('calculateScore', () => {
    test('calculates base score based on level', () => {
      expect(calculateScore(1, 0)).toBe(1000);
      expect(calculateScore(2, 0)).toBe(2000);
      expect(calculateScore(10, 0)).toBe(10000);
    });
    
    test('adds time bonus to score', () => {
      expect(calculateScore(1, 20)).toBe(1200); // 1000 + (20/10)*100
      expect(calculateScore(2, 30)).toBe(2300); // 2000 + (30/10)*100
    });
  });

  describe('getRandomIndex', () => {
    test('returns a number within the range', () => {
      // Mock Math.random to return a predictable value
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5);
      
      expect(getRandomIndex(10)).toBe(5);
      expect(getRandomIndex(100)).toBe(50);
      
      // Restore original Math.random
      Math.random = originalRandom;
    });
  });

  describe('shuffleArray', () => {
    test('returns an array with the same elements', () => {
      // Mock Math.random for predictable shuffle
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5);
      
      const original = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray(original);
      
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled).toEqual(expect.arrayContaining(original));
      
      // Restore original Math.random
      Math.random = originalRandom;
    });
    
    test('does not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const copy = [...original];
      shuffleArray(original);
      expect(original).toEqual(copy);
    });
  });

  describe('getFiftyFiftyOptions', () => {
    test('returns array with correct answer and one other option', () => {
      const options = ['A', 'B', 'C', 'D'];
      const correctAnswer = 'C';
      
      // Mock Math.random
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5);
      
      const result = getFiftyFiftyOptions(options, correctAnswer);
      
      expect(result).toHaveLength(2);
      expect(result).toContain(correctAnswer);
      
      // Restore Math.random
      Math.random = originalRandom;
    });
    
    test('handles case with only two options', () => {
      const options = ['Yes', 'No'];
      const correctAnswer = 'Yes';
      
      const result = getFiftyFiftyOptions(options, correctAnswer);
      
      expect(result).toHaveLength(2);
      expect(result).toContain('Yes');
      expect(result).toContain('No');
    });
  });
});
