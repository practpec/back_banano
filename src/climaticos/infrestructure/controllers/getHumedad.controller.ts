import { Request, Response } from "express";
import { ClimaticoApplication } from "../../application/useCases/climaticos.application";
import { MysqlRepository } from "../dataAccess/mysql.repository";

const mysqlRepository = new MysqlRepository();
const climaticoAppService = new ClimaticoApplication(mysqlRepository);


export class GetControllerHumedad {

    static async getHumedad(req: Request, res: Response): Promise<void> {

        try {
            const getHumedad = await climaticoAppService.getClimaticoHumedad();

            res.status(200).json({
                message: 'Se obtuvieron correctamente los datos de la humedad',
                data: getHumedad
            })
        } catch (error) {
            console.log('Hubo un error al obtener los datos de la humedad', error);
            res.status(500).json({
                error: 'Hubo un error al obtener los datos de la humedad'
            })
        }
    }
}