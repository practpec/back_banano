import { query } from "../../../database/db.config";
import { Notificaciones } from "../../dominio/entities/notificaciones";
import { NotificationRepository } from "../../dominio/repository/Notification.repository";


export class MysqlRepository implements NotificationRepository {

    createNotification = async (notificaciones: Notificaciones): Promise<any> => {
       const  sql = 'INSERT INTO notificaciones (tipo, descripcion) VALUES (?, ?)';
       const params = [notificaciones.tipo, notificaciones.descripcion];

       try {
        const result = await query(sql, params);
        return result;
       } catch ( error ) {
        console.log('Error al crear la notificacion en MYSQL', error);
        throw new Error('Error al crear la notificacion en MYSQL' + error);
       }
    }


  deleteNotification = async (notificacionId: number): Promise<any> => {
      const sql = 'DELETE FROM notificaciones WHERE id = ?';
      const params = [notificacionId];

      try {
        const result = await query(sql, params);
        return result;
      } catch ( error ) {
        console.log('Error al eliminar la notificacion', error);
        throw new Error('Error al eliminar la notificacion' + error);
      }
  }
    
  updateNotification = async(notificacionId: number): Promise<any> => {
      const sql = 'UPDATE notificaciones SET estado = "Leido" WHERE ID = ?';
      const params = [notificacionId];

      try {
        const result = await query(sql, params);
        return result;
      } catch ( error ) {
        console.log('Error al actualizar el estado de la noticacion', error);
        throw new Error('Error el actualizar el estado de la notificacion' + error)
      }
  }

  getAllNotification = async (): Promise<Notificaciones[]> => {
    const sql = 'SELECT id, tipo, descripcion, fecha, estado FROM notificaciones';

    try {
        const [result]: any = await query(sql, []);

        const notifications: Notificaciones[] = result.map((notificationData: any) => {
            return {
                id: notificationData.id,
                tipo: notificationData.tipo,
                descripcion: notificationData.descripcion,
                fecha: notificationData.fecha,
                estado: notificationData.estado
            };
        });

        return notifications;
    } catch (error) {
        console.log('Error al obtener las notificaciones', error);
        throw new Error('Error al obtener las notificaciones' + error);
    }
}
}


