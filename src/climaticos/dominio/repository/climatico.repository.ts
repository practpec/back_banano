import { Climaticos } from "../entities/climaticos";

export interface ClimaticoRepository {
    getClimaticoHumedad(): Promise<Climaticos[] | null>;
    getClimaticoTemperatura(): Promise<Climaticos[] | null>;
    updateClimaticoHumedad(climaticoId: number, nuevaHumedadMax: number, nuevaHumedadMin: number): Promise<boolean>;
    updateClimaticoTemperatura(climaticoId: number, nuevaTemperaturaMax: number, nuevaTempreaturaMin: number): Promise<boolean>;
}