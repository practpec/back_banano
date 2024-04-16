import express from 'express';
import { GetControllerHumedad } from '../controllers/getHumedad.controller';
import { GetControllerTemperatura } from '../controllers/getTemperatura.Controller';
import { UpdateControllerHumedad } from '../controllers/updateHumedad.Controller';
import { UpdateControllerTemperatura } from '../controllers/updateTemperatura.Controller';

export const router = express.Router();

router.get('/humedad', GetControllerHumedad.getHumedad);
router.get('/temperatura', GetControllerTemperatura.getTemperatura);
router.put('/humedad', UpdateControllerHumedad.updateHumedad);
router.put('/temperatura', UpdateControllerTemperatura.updateTemperatura);

export default router;