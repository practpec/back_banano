import { Racimos } from "../../dominio/entities/racimos";
import { RacimoRepository } from "../../dominio/respository/racimo.repository";

export class RacimoApplication {
    constructor (private  racimoRepository: RacimoRepository) {}

    async createRacimo(racimos: Racimos): Promise<any> {
        return this.racimoRepository.createRacimo(racimos);
    }
}