import { Racimos } from "../entities/racimos";

export interface RacimoRepository {
    createRacimo(racimos: Racimos): Promise<any>;
    getAllRacimo(): Promise<Racimos [] | null>;
    getDatos(dato: string): Promise<number[]| null>;
}