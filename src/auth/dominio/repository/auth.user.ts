

export interface AuthUser {
    getUserByEmail(correo: string): Promise<any>;
}