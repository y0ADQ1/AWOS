import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const secret = process.env.JWT_SECRET || 'secret_key'; // Obtén tu clave secreta desde .env

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied, Token Missing' });
    }

    try {
        const decoded = jwt.verify(token, secret); // Verifica el token
        (req as any).user = decoded; // Opcional: Añade la información del usuario al objeto de la solicitud
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid Token' });
    }
};