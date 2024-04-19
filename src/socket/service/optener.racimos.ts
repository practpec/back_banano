import { RacimoApplication } from "../../racimos/application/useCases/racimo.application";
import { MysqlRepository } from "../../racimos/infrestructure/dataAccess/mysql.respository";
import { Racimos } from "../../racimos/dominio/entities/racimos";

const mysqlRepository = new MysqlRepository();
const racimoAppService = new RacimoApplication(mysqlRepository);

async function obtenerTodosLosRacimos(): Promise<Racimos[] | null> {
    try {
        const racimos = await racimoAppService.getAllRacimo();
        return racimos;
    } catch (error) {
        console.error('Hubo un error al obtener los racimos', error);
        throw new Error('Hubo un error al obtener los racimos');
    }
}


export {obtenerTodosLosRacimos}