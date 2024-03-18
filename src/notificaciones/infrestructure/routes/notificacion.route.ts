import express from 'express';
import { NotificacionController } from '../controller/notification.controller';
import { DeleteController } from '../controller/delete.controller';
import { UpdateController } from '../controller/update.controller';
import { GetAllController } from '../controller/getAll.controller';
import { verifyToken } from '../../../auth/application/middleware/jwt.middleware';


export const router = express.Router();

router.get('/', verifyToken, GetAllController.getAllNotification);
router.post('/', verifyToken, NotificacionController.createNotification);
router.delete('/:id', verifyToken, DeleteController.deleteNotification);
router.put('/:id', verifyToken, UpdateController.updateNotification);

export default router;