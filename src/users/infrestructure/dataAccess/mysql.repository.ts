import { query } from '../../../database/db.config';
import { User } from '../../dominio/entities/user';
import { UserRepository } from '../../dominio/repository/user.repository';

export class MysqlRepository implements UserRepository {

    createUser = async (user: User): Promise<any> => {
        const sql = 'INSERT INTO user (nombre, apellido, correo, password) VALUES (?, ?, ?, ?)';
        const params = [user.nombre, user.apellido, user.correo, user.password];

        try {
            const result = await query(sql, params);
            return result;
        } catch ( error ){
            console.log('Error el crear al usuario en MYSQL', error);
            throw new Error('Error al crear al usuario en MYSQL' + error);
        }
    };

    
}