import { Request, Response } from "express";
import { NotificationApplication } from "../../application/useCases/notification.application";
import { MysqlRepository } from "../dataAccess/mysql.repository";
import { Notificaciones } from "../../dominio/entities/notificaciones";


const mysqlRepository = new MysqlRepository();
const notificacionAppService = new NotificationApplication(mysqlRepository);


export class NotificacionController {

    static async createNotification ( req: Request, res: Response): Promise<any> {
      
        try {
             const newNotification: Notificaciones = req.body;
             notificacionAppService.createNotification(newNotification)

             res.status(201).json({
                message: 'Se creo correctamente la notificacion',
                data: newNotification
             });
        } catch ( error ) {
            console.log('Hubo un error al crear la notificacion');
            res.status(500).json({
                error: 'Hubo un error al crear la notificacion'
            })
        };
    }
}