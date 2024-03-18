import { Notificaciones } from "../entities/notificaciones";

export interface NotificationRepository {
    createNotification(notificaciones: Notificaciones): Promise<any>;
    deleteNotification(notificacionId: number): Promise<void>;
    updateNotification(notificacionId: number): Promise<any>;
    getAllNotification(): Promise<Notificaciones[] | null>;
}
