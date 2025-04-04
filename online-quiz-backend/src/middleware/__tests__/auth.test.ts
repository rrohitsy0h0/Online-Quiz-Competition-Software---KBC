import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';  // Add JwtPayload to the import

// Define a type for the decoded token
type DecodedToken = {
  id: string;
  username: string;
  [key: string]: any; // Allow for additional properties
};

// Create a more straightforward type extending Request
type RequestWithUser = Request & {
  user?: any;
};

const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  // Check if token exists
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'testsecret');
    // Set user info from decoded token
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
}

// Define a simpler mock request type
interface MockRequest {
  user?: any;
  headers: {
    authorization?: string;
  };
}

// Better typed mock response
interface MockResponse {
  status: jest.Mock<any>;
  json: jest.Mock<any>;
  // Add other response methods you might use
}

// Mock jwt and request/response objects
jest.mock('jsonwebtoken');

describe('Authentication Middleware', () => {
  let mockRequest: MockRequest;
  let mockResponse: MockResponse;
  let nextFunction: NextFunction;
  
  beforeEach(() => {
    mockRequest = {
      headers: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });
  
  it('should return 401 if no token is provided', () => {
    authMiddleware(mockRequest as RequestWithUser, mockResponse as unknown as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });
  
  it('should return 401 if token is invalid', () => {
    mockRequest.headers.authorization = 'Bearer invalid-token';
    
    // Cast jwt.verify to the correct mock type
    const jwtVerifyMock = jwt.verify as jest.MockedFunction<typeof jwt.verify>;
    jwtVerifyMock.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    authMiddleware(mockRequest as RequestWithUser, mockResponse as unknown as Response, nextFunction);
    
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });
  
  it('should call next() if token is valid', () => {
    mockRequest.headers.authorization = 'Bearer valid-token';
    
    const mockDecodedToken: DecodedToken = { 
      id: 'user-id', 
      username: 'testuser' 
    };
    
    const jwtVerifyMock = jwt.verify as jest.MockedFunction<typeof jwt.verify>;
    
    // Now use JwtPayload directly since we imported it
    jwtVerifyMock.mockReturnValue(mockDecodedToken as any);
    
    authMiddleware(mockRequest as RequestWithUser, mockResponse as unknown as Response, nextFunction);
    
    expect(mockRequest.user).toEqual(mockDecodedToken);
    expect(nextFunction).toHaveBeenCalled();
  });
});
