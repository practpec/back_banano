import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SECRET_JWT } from '../../dominio/constants/secret';

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        res.status(401).json({ message: 'Token de autenticación no proporcionado' });
        return;
    }

    const token = authorizationHeader.split(' ')[1]; 

    try {
        const decoded = jwt.verify(token, SECRET_JWT); 
        

        (req as any).user = decoded;
        next(); 
    } catch (error) {
        console.error('Error al verificar el token:', error);
        res.status(403).json({ message: 'Token de autenticación inválido' });
    }
}
