import { Request, Response } from "express";
import { RacimoApplication } from "../../application/useCases/racimo.application";
import { MysqlRepository } from "../dataAccess/mysql.respository";


const mysqlRepository = new MysqlRepository();
const racimoAppService = new RacimoApplication(mysqlRepository);


export class GetAllController {

    static async getAllRacimo(req: Request, res: Response): Promise<void> {

        try {
            const racimos = await racimoAppService.getAllRacimo();

            res.status(200).json({
                message: 'Se obtuvieron correctamente todos los racimos',
                data: racimos
            });
        } catch (error) {
            console.log('Hubo un error al obtener los racimos', error);
            res.status(500).json({
                error: 'Hubo un error al obtener los racimos'
            })
        }
    }
}