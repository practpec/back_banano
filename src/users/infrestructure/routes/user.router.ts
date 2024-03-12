import express from 'express';
import { UserController } from '../controller/user.controller';
import { verifyToken } from '../../../auth/application/middleware/jwt.middleware';

export const router = express.Router();

router.post('/', verifyToken ,UserController.createUser);

export default router;