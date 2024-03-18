import express from 'express';
import { RacimoController } from '../controller/racimo.controller';

export const router = express.Router();

router.post('/', RacimoController.createRacimo);

export default router;