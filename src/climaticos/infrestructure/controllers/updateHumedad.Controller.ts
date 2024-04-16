import { Request, Response } from "express";
import { ClimaticoApplication } from "../../application/useCases/climaticos.application";
import { MysqlRepository } from "../dataAccess/mysql.repository";

const mysqlRepository = new MysqlRepository();
const climaticoAppService = new ClimaticoApplication(mysqlRepository);

export class UpdateControllerHumedad {

    static async updateHumedad(req: Request, res: Response): Promise<void> {
        const { climaticoId, nuevaHumedadMax, nuevaHumedadMin } = req.body;
        
        try {
            await climaticoAppService.updateClimaticoHumedad(climaticoId, nuevaHumedadMax, nuevaHumedadMin);
            
            res.status(200).json({
                message: 'Los datos de humedad se actualizaron correctamente'
            });
        } catch (error) {
            console.log('Hubo un error al actualizar los datos de humedad', error);
            res.status(500).json({
                error: 'Hubo un error al actualizar los datos de humedad'
            });
        }
    }
}
