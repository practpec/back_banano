import { Climaticos } from "../../dominio/entities/climaticos";
import { ClimaticoRepository } from "../../dominio/repository/climatico.repository";

export class ClimaticoApplication {
    constructor (private climaticoRepository: ClimaticoRepository) {}

    async getClimaticoHumedad(): Promise<Climaticos[] | null> {
        return await this.climaticoRepository.getClimaticoHumedad();
    }

    async getClimaticoTemperatura(): Promise<Climaticos[] | null> {
        return await this.climaticoRepository.getClimaticoTemperatura();
    }

    async updateClimaticoTemperatura(climaticoId: number, nuevaTemperaturaMax: number, nuevaTemperaturaMin: number): Promise<boolean> {
        return await this.climaticoRepository.updateClimaticoTemperatura(climaticoId, nuevaTemperaturaMax, nuevaTemperaturaMin);
    }

    async updateClimaticoHumedad(climaticoId: number, nuevaHumedadMax: number, nuevaHumedadMin: number): Promise<boolean> {
        return await this.climaticoRepository.updateClimaticoHumedad(climaticoId, nuevaHumedadMax, nuevaHumedadMin);
    }
}