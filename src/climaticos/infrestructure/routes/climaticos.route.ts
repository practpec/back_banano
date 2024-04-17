import express from 'express';
import { GetControllerHumedad } from '../controllers/getHumedad.controller';
import { GetControllerTemperatura } from '../controllers/getTemperatura.Controller';
import { UpdateControllerHumedad } from '../controllers/updateHumedad.Controller';
import { UpdateControllerTemperatura } from '../controllers/updateTemperatura.Controller';
import { verifyToken } from '../../../auth/application/middleware/jwt.middleware';

export const router = express.Router();

router.get('/humedad', verifyToken, GetControllerHumedad.getHumedad);
router.get('/temperatura', verifyToken, GetControllerTemperatura.getTemperatura);
router.put('/humedad', verifyToken, UpdateControllerHumedad.updateHumedad);
router.put('/temperatura', verifyToken, UpdateControllerTemperatura.updateTemperatura);

export default router;