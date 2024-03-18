import { Request, Response } from "express";
import { NotificationApplication } from "../../application/useCases/notification.application";
import { MysqlRepository } from "../dataAccess/mysql.repository";

const mysqlRepository = new MysqlRepository();
const NotificacionAppService = new NotificationApplication(mysqlRepository);


export class UpdateController {

    static async updateNotification(req: Request, res: Response): Promise<any> {
         
        try {
            const notificationId: number = parseInt(req.params.id, 10);

            NotificacionAppService.updateNotification(notificationId);

            res.status(200).json({
                message: 'Se actualizo correctamente el estado de la notificacion',
                data: notificationId
            });
        } catch ( error ) {
            console.log('Hubo un error al actualizar la notificacion', error);
            res.status(500).json({
                error: 'Hubo un error al actualizar la notificacion'
            })
        }
    }
}