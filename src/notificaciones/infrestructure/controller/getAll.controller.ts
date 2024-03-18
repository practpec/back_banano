import { Request, Response } from "express";
import { NotificationApplication } from "../../application/useCases/notification.application";
import { MysqlRepository } from "../dataAccess/mysql.repository";

const mysqlRepository = new MysqlRepository();
const notificationAppService = new NotificationApplication(mysqlRepository);


export class GetAllController {

    static async getAllNotification(req: Request, res: Response): Promise<void> {

        try {
            const notifications = await notificationAppService.getAllNotifications();

            res.status(200).json({
                message: 'Se obtuvieron correctamente todas las notificaciones',
                data: notifications
            });
        } catch ( error ) {
            console.log('Hubo un error al obtener las notificaciones', error);
            res.status(500).json({
                error: 'Hubo un error al obtener las notificaciones'
            })
        }
    }
}