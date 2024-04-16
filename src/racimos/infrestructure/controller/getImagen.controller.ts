import { Request, Response } from "express";
import { RacimoApplication } from "../../application/useCases/racimo.application";
import { MysqlRepository } from "../dataAccess/mysql.respository";
import fs from 'fs';

const mysqlRepository = new MysqlRepository();
const racimoAppService = new RacimoApplication(mysqlRepository);

export class GetImagenController {

    static async getImagen(req: Request, res: Response): Promise<void> {
        try {
            const imagenesBase64 = await racimoAppService.getImagen();

            res.status(200).json({
                message: 'Se obtuverion correctamente la imagenes',
                data: imagenesBase64
            })
        } catch (error) {
            console.log('Hubo un error al obtener la imagen', error);
            res.status(500).json({
                message: 'Hubo un error al obtener la imagen'
            });
        }
    }
}
