import express from 'express';
import { RacimoController } from '../controller/racimo.controller';
import { GetAllController } from '../controller/getAll.controller';
import { GetDatosController } from '../controller/getDato.controller';

export const router = express.Router();

router.post('/', RacimoController.createRacimo);
router.get('/:dato', GetDatosController.getDatos);
router.get('/', GetAllController.getAllRacimo);


export default router;