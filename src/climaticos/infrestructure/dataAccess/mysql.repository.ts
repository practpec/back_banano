import { query } from "../../../database/db.config";
import { Climaticos } from "../../dominio/entities/climaticos";
import { ClimaticoRepository } from "../../dominio/repository/climatico.repository";


export class MysqlRepository implements ClimaticoRepository {
    
    getClimaticoTemperatura = async(): Promise<Climaticos[]> => {
        const sql = 'SELECT id, temperatura_max, temperatura_min FROM DatosClimaticos';

        try {
            const [result]: any = await query(sql, []);

            const temperatura: Climaticos[] = result.map((temperaturaData: any) => {
                return {
                    temperatura_max: temperaturaData.temperatura_max,
                    temperatura_min: temperaturaData.temperatura_min
                };
            });
            return temperatura;
        } catch (error) {
            console.log('Hubo un error al obtener las temperaturas', error);
            throw new Error('Hubo un error al obtener las temperaturas' + error);
        }
    }

    getClimaticoHumedad = async(): Promise<Climaticos[]> => {
        const sql = 'SELECT od, humedad_max, humedad_min FROM DatosClimaticos';

        try {
            const [result]: any = await query(sql, []);

            const humedad: Climaticos[] = result.map((humedadData: any) => {
                return {
                    humedad_max: humedadData.humedad_max,
                    humedad_min: humedadData.humedad_min
                };
            });
            return humedad;
        } catch (error) {
            console.log('Hubo un error al obtener las humedades', error);
            throw new Error('Hubo un error al obtener las humedades' + error);
        }
    }

    updateClimaticoTemperatura = async (climaticoId: number, nuevaTemperaturaMax: number, nuevaTemperaturaMin: number): Promise<boolean> => {
        const sql = 'UPDATE DatosClimaticos SET temperatura_max = ?, temperatura_min = ? WHERE id = ?';
        const params = [nuevaTemperaturaMax, nuevaTemperaturaMin, climaticoId];

        try {
            await query(sql, params);
            return true;
        } catch (error) {
            console.log('Hubo un error al actualizar los datos de temperatura', error);
            throw new Error('Hubo un error al actualizar los datos de temperatura' + error);
        }
    }

  
    updateClimaticoHumedad = async (climaticoId: number, nuevaHumedadMax: number, nuevaHumedadMin: number): Promise<boolean> => {
        const sql = 'UPDATE DatosClimaticos SET humedad_max = ?, humedad_min = ? WHERE id = ?';
        const params = [nuevaHumedadMax, nuevaHumedadMin, climaticoId];

        try {
            await query(sql, params);
            return true;
        } catch (error) {
            console.log('Hubo un error al actualizar los datos de humedad', error);
            throw new Error('Hubo un error al actualizar los datos de humedad' + error);
           
        }
    }
}