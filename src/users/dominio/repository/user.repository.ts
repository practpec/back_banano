import { User } from "../entities/user";

export interface UserRepository {
    createUser(user: User): Promise<any>;
    deleteUser(usercorreo: string): Promise<void>;
}