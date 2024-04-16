import { Request, Response } from "express";
import { ClimaticoApplication } from "../../application/useCases/climaticos.application";
import { MysqlRepository } from "../dataAccess/mysql.repository";

const mysqlRepository = new MysqlRepository();
const climaticoAppService = new ClimaticoApplication(mysqlRepository);

export class UpdateControllerTemperatura {

    static async updateTemperatura(req: Request, res: Response): Promise<void> {
        const { climaticoId, nuevaTemperaturaMax, nuevaTemperaturaMin } = req.body;
        
        try {
            await climaticoAppService.updateClimaticoTemperatura(climaticoId, nuevaTemperaturaMax, nuevaTemperaturaMin);
            
            res.status(200).json({
                message: 'Los datos de temperatura se actualizaron correctamente'
            });
        } catch (error) {
            console.log('Hubo un error al actualizar los datos de temperatura', error);
            res.status(500).json({
                error: 'Hubo un error al actualizar los datos de temperatura'
            });
        }
    }
}
