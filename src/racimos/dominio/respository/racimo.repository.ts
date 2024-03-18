import { Racimos } from "../entities/racimos";

export interface RacimoRepository {
    createRacimo(racimos: Racimos): Promise<any>;
}