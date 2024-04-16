import { Request, Response } from "express";
import { ClimaticoApplication } from "../../application/useCases/climaticos.application";
import { MysqlRepository } from "../dataAccess/mysql.repository";

const mysqlRepository = new MysqlRepository();
const climaticoAppService = new ClimaticoApplication(mysqlRepository);


export class GetControllerTemperatura {

    static async getTemperatura(req: Request, res: Response): Promise<void> {

        try {
            const getTemperatura = await climaticoAppService.getClimaticoTemperatura();

            res.status(200).json({
                message: 'Se obtuvieron correctamente los datos de la temperatura',
                data: getTemperatura
            })
        } catch (error) {
            console.log('Hubo un error al obtener los datos de la temperatura', error);
            res.status(500).json({
                error: 'Hubo un error al obtener los datos de la temperatura'
            })
        }
    }
}