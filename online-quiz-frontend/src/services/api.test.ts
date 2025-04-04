// Add an export to make this a module
export {};

// Use require instead of import to avoid SyntaxError in Jest
const axios = require('axios');

// Mock axios for testing
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// API service functions to test
const fetchQuestions = async (level: number) => {
  try {
    const response = await axios.get(`/api/questions/level/${level}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

const submitAnswer = async (questionId: string, answer: string) => {
  try {
    const response = await axios.post('/api/answers', { questionId, answer });
    return response.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    return { success: false };
  }
};

const getLeaderboard = async () => {
  try {
    const response = await axios.get('/api/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};

const useLifeline = async (type: string, questionId: string) => {
  try {
    const response = await axios.get(`/api/questions/lifeline/${type}/${questionId}`);
    return response.data;
  } catch (error) {
    console.error(`Error using ${type} lifeline:`, error);
    return null;
  }
};

describe('API Service Tests', () => {
  test('fetchQuestions returns data on success', async () => {
    const mockQuestions = [
      { id: '1', question: 'Test question', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' }
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockQuestions });
    
    const result = await fetchQuestions(1);
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/questions/level/1');
    expect(result).toEqual(mockQuestions);
  });
  
  test('fetchQuestions returns empty array on error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
    
    const result = await fetchQuestions(1);
    expect(result).toEqual([]);
  });

  test('submitAnswer returns data on success', async () => {
    const mockResponse = { success: true, message: 'Correct answer!' };
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });
    
    const result = await submitAnswer('1', 'A');
    expect(mockedAxios.post).toHaveBeenCalledWith('/api/answers', { questionId: '1', answer: 'A' });
    expect(result).toEqual(mockResponse);
  });
  
  test('submitAnswer returns failure object on error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));
    
    const result = await submitAnswer('1', 'A');
    expect(result).toEqual({ success: false });
  });

  test('getLeaderboard returns data on success', async () => {
    const mockLeaderboard = [
      { username: 'user1', score: 1000 },
      { username: 'user2', score: 500 }
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: mockLeaderboard });
    
    const result = await getLeaderboard();
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/leaderboard');
    expect(result).toEqual(mockLeaderboard);
  });
  
  test('getLeaderboard returns empty array on error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
    
    const result = await getLeaderboard();
    expect(result).toEqual([]);
  });

  test('useLifeline returns data on success', async () => {
    const mockLifelineResponse = { options: ['A', 'C'] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockLifelineResponse });
    
    const result = await useLifeline('fifty-fifty', '1');
    expect(mockedAxios.get).toHaveBeenCalledWith('/api/questions/lifeline/fifty-fifty/1');
    expect(result).toEqual(mockLifelineResponse);
  });
  
  test('useLifeline returns null on error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
    
    const result = await useLifeline('fifty-fifty', '1');
    expect(result).toBeNull();
  });
});
