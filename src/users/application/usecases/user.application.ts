import { User } from '../../dominio/entities/user';
import { UserRepository } from '../../dominio/repository/user.repository';

export class UserApplication {
    constructor(private userRepository: UserRepository) {}

    async createUser(user: User): Promise<any> {
        return await this.userRepository.createUser(user);
    }
}