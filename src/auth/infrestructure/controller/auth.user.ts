import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { MysqlRepository } from '../myslRepository/myql.repository';
import { AuthRequest } from '../../dominio/entities/auth.Request';
import bcrypt from 'bcrypt';
import { SECRET_JWT } from '../../dominio/constants/secret';

export class AuthController {
    private static mysqlRepository = new MysqlRepository(); 

    static login = async (req: Request, res: Response): Promise<void> => {
        const { correo, password } = req.body;
        const authRequest: AuthRequest = { correo, password };  

        try {
            const user = await AuthController.mysqlRepository.getUserByEmail(authRequest.correo);
            
            if (!user) {
                res.status(404).json({ message: 'Usuario no encontrado' });
                return;
            }

            const userPassword = user[0][0].password;

            const passwordMatch = await bcrypt.compare(password, userPassword);

            if (!passwordMatch) {
                res.status(401).json({ message: 'Contraseña incorrecta' });
                return;
            }

            
            const token = jwt.sign({ correo: authRequest.correo }, SECRET_JWT, { expiresIn: '1h' });

            res.status(200).json({ 
                message: 'El acceso fue correcto',
                token
             });
        } catch (error) {
            console.error('Error en la autenticación:', error);
            res.status(500).json({ message: 'Error en la autenticación' });
        }
    }
}
