import { render } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Mock any required context providers or services
jest.mock('./contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    user: null,
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

test('renders the app without crashing', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  // Basic assertion that the component renders
  expect(document.body).toBeInTheDocument();
});
