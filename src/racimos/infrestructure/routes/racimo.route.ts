import express from 'express';
import multer from 'multer';
import { RacimoController } from '../controller/racimo.controller';
import { GetAllController } from '../controller/getAll.controller';
import { GetDatosController } from '../controller/getDato.controller';
import { GetImagenController } from '../controller/getImagen.controller';

export const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

router.post('/', upload.single('imagen'), RacimoController.createRacimo);
router.get('/imagen', GetImagenController.getImagen);
router.get('/:dato', GetDatosController.getDatos);
router.get('/', GetAllController.getAllRacimo);


export default router;