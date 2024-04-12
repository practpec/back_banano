import { Request, Response } from "express";
import { NotificationApplication } from "../../application/useCases/notification.application";
import { MysqlRepository } from "../dataAccess/mysql.repository";

const mysqlRepository = new MysqlRepository();
const NotificacionAppService = new NotificationApplication(mysqlRepository);



export class DeleteController {

    static async deleteNotification(req: Request, res: Response): Promise<void> {
        try {

        const  notificacionId: number = parseInt(req.params.id, 10);
        
        NotificacionAppService.deleteNotification(notificacionId);

        
        res.status(200).json({
            message: 'Se elimino correctamente la notificacion',
            data: notificacionId
        });
       }  catch ( error ) {
        console.log('Hubo un error al eliminar la notificacion', error);
        res.status(500).json({
            error: 'Hubo un error al eliminar la notificacion'
        })
       }
    }
}