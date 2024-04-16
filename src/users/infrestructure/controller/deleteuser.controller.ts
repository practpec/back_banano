import { Request, Response } from "express";
import { UserApplication } from "../../application/usecases/user.application";
import { MysqlRepository } from "../dataAccess/mysql.repository";


const mysqlRepository = new MysqlRepository();
const userAppService = new UserApplication(mysqlRepository);


export class DeleteController {

    static async deleteUser(req: Request, res: Response): Promise<void> {
      try {
       const usercorreo: string = req.params.correo;

       userAppService.deleteUser(usercorreo);
     
       res.status(200).json({
        message: 'Se elimino correctamente al usuario',
        data:  usercorreo
       })
      } catch (error) {
        console.log('Hubo un error al eliminar el usuario', error);
        res.status(500).json({
            error: 'Hubo un error al eliminar el usuario'
        })
      }
    }
}