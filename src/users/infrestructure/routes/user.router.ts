import express from 'express';
import { UserController } from '../controller/user.controller';
import { DeleteController } from '../controller/deleteuser.controller';
import { verifyToken } from '../../../auth/application/middleware/jwt.middleware';

export const router = express.Router();

router.post('/', verifyToken, UserController.createUser);
router.delete('/:correo', verifyToken, DeleteController.deleteUser);

export default router;