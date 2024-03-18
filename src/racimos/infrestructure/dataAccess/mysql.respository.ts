import { query } from "../../../database/db.config";
import { Racimos } from "../../dominio/entities/racimos";
import { RacimoRepository } from "../../dominio/respository/racimo.repository";

export class MysqlRepository implements RacimoRepository {

    createRacimo = async(racimos: Racimos): Promise<any> => {
        const sql = 'INSERT INTO racimos (temperatura, luz, humedad, imagen) VALUES (?, ?, ?, ?)';
        const params = [racimos.temperatura, racimos.luz, racimos.humedad, racimos.imagen];

        try {
            const result = await query(sql, params);
            return result;
        } catch ( error ){
            console.log('Error al crear los datos del racimo', error);
            throw new Error('Error al crear los datos del racimo' + error);
        }
    }
}