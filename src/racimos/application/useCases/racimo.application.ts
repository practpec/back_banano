import { Racimos } from "../../dominio/entities/racimos";
import { RacimoRepository } from "../../dominio/respository/racimo.repository";

export class RacimoApplication {
    constructor (private  racimoRepository: RacimoRepository) {}

    async createRacimo(racimos: Racimos): Promise<any> {
        return this.racimoRepository.createRacimo(racimos);
    }

    async getAllRacimo(): Promise<Racimos[] | null> {
        return this.racimoRepository.getAllRacimo();
    }

    async getDatos(dato: string): Promise<number[] | null> {
        return  this.racimoRepository.getDatos(dato);
    }
}