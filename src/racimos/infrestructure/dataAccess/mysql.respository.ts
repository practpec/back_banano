import { query } from "../../../database/db.config";
import { Racimos } from "../../dominio/entities/racimos";
import { RacimoRepository } from "../../dominio/respository/racimo.repository";


export class MysqlRepository implements RacimoRepository {
    
    createRacimo = async(racimos: Racimos): Promise<any> => {
        const sql = 'INSERT INTO racimos (temperatura, luz, humedad, distancia) VALUES (?, ?, ?, ?)';
        const params = [racimos.temperatura, racimos.luz, racimos.humedad, racimos.distancia];

        try {
            const result = await query(sql, params);
            return result;
        } catch ( error ){
            console.log('Error al crear los datos del racimo', error);
            throw new Error('Error al crear los datos del racimo' + error);
        }
    }


    getAllRacimo = async(): Promise<Racimos[]> => {
        const sql = 'SELECT id, fecha, temperatura, luz, humedad, distancia FROM racimos';

        try {
            const [result]: any = await query(sql, []);

            const racimos: Racimos[] = result.map((racimoData: any) => {
                return {
                    id: racimoData.id,
                    fecha: racimoData.fecha,
                    temperatura: racimoData.temperatura,
                    luz: racimoData.luz,
                    humedad: racimoData.humedad,
                    distancia: racimoData.distancia
                };
            });
            return racimos;
        } catch (error) {
            console.log('Hubo un error al obtener los racimos', error);
            throw new Error('Hubo un error al obtener los racimos' + error);
        }
    }

    getDatos = async(dato: string): Promise<number[] | null> => {
        const sql = `SELECT ${dato} FROM racimos`;

        try {
            const [result]: any = await query(sql, []);

            const datos: number[] = result.map((row: any) =>  row[dato]);
            return datos;
        } catch (error) {
            console.log('Hubo un error al obtener los datos', error);
            throw new Error('Hubo un error al obtener los datos' + error)
        }
    }
}