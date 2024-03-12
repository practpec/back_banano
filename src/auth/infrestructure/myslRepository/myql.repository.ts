import { query } from "../../../database/db.config";
import { AuthRequest } from "../../dominio/entities/auth.Request";
import { AuthUser } from "../../dominio/repository/auth.user";

export class MysqlRepository implements AuthUser {
    getUserByEmail = async (correo: string): Promise<any> => {
        const sql = 'SELECT password FROM user WHERE correo = ?';
        const params: any[] = [correo];
        
        try {
            const result: any = await query(sql, params);
            
            if (!result) {
                return null; 
            }
            
            return result; 
        } catch (error) {
            console.log('Hubo un error al buscar el usuario', error);
            throw error;
        }
    }
}
