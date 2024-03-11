import express from 'express';
import { UserController } from '../controller/user.controller';

export const router = express.Router();

router.post('/', UserController.createUser);

export default router;