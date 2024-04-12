import { Request, Response } from "express";
import { RacimoApplication } from "../../application/useCases/racimo.application";
import { MysqlRepository } from "../dataAccess/mysql.respository";


const mysqlRepository = new MysqlRepository();
const racimoAppService = new RacimoApplication(mysqlRepository);


export class GetDatosController {

    static async getDatos(req: Request, res: Response): Promise<void> {

        const { dato } = req.params;
        try {

            const temperaturas = await racimoAppService.getDatos(dato);

            res.status(200).json({
                message: 'Se obtuvieron correctamente los datos de temperatura',
                data: temperaturas
            });
            
        } catch (error) {
            console.log('Hubo un error al obtener los datos de temperatura', error);
            res.status(500).json({
                message: 'Hubo un error al obtener los datos de temperatura'
            })
        }
    }
}