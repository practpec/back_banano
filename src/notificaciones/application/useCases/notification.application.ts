import { Notificaciones } from "../../dominio/entities/notificaciones";
import { NotificationRepository } from "../../dominio/repository/Notification.repository";


export class NotificationApplication {
    constructor (private notificationRepository: NotificationRepository) {}

    async createNotification(notificaciones: Notificaciones): Promise<any> {
        return await this.notificationRepository.createNotification(notificaciones);
    }

    async deleteNotification(notificacionId: number): Promise<void> {
        return await this.notificationRepository.deleteNotification(notificacionId);
    }

    async updateNotification(notificacionId: number): Promise<any> {
        return await this.notificationRepository.updateNotification(notificacionId);
    }
    
      async getAllNotifications(): Promise<Notificaciones[] | null> {
        return await this.notificationRepository.getAllNotification();
    }
}