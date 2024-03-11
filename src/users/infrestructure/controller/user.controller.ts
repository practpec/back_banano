import { Request, Response } from "express";
import { UserApplication } from '../../application/usecases/user.application';
import { MysqlRepository } from '../dataAccess/mysql.repository';
import { EncryptService } from "../helpers/encrypt.helpers";
import { NodemailerEmailService } from "../helpers/notification.email";
import { User } from "../../dominio/entities/user";

const mysqlRepository = new MysqlRepository();
const userAppService = new UserApplication(mysqlRepository);
const encryptPassword = new  EncryptService();
const emailService = new NodemailerEmailService();

export class UserController {

    static  async createUser ( req: Request, res: Response): Promise<any>{
        try {
            const { nombre, apellido, correo, password } = req.body;
            const hashedPassword = encryptPassword.endecodePassword(password);
            const newUser = new User(0, nombre, apellido, correo, hashedPassword);


            await userAppService.createUser(newUser);
            await emailService.sendWelcomeEmail(correo, nombre);

            res.status(201).json({
                message: 'El usuario se creo exitosamente',
                data: newUser
            });
        } catch ( error ) {
            console.log('Hubo un error al crear al crear el usuario', error)
            res.status(500).json({
                error:'Hubo un error al crear al usuario'
                
            })
        };
    }
}