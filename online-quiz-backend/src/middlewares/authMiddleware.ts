import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
    };
}

interface DecodedToken {
    id: string;
    username: string;
    iat?: number;
    exp?: number;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'abc123') as DecodedToken; // Using JWT_SECRET here
        req.user = {
            id: decoded.id,
            username: decoded.username
        };
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token is not valid.' });
    }
};