// Servidor
import WebSocket from 'ws';
import http from 'http';
import { RacimoApplication } from "../racimos/application/useCases/racimo.application";
import { MysqlRepository } from "../racimos/infrestructure/dataAccess/mysql.respository";
import { Racimos } from '../racimos/dominio/entities/racimos';

const server = http.createServer();
const wss = new WebSocket.Server({ port: 4000 });

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

function conectarWebSocket(): void {
    wss.on('connection', (ws: WebSocket) => {
        console.log('Nuevo cliente conectado con WebSocket');

        ws.on('close', () => {
            console.log('Cliente desconectado de WebSocket');
        });

        // Llama a la función para obtener y emitir datos después de que se establezca la conexión WebSocket
        obtenerYEnviarDatos(ws);
    });
}

async function obtenerYEnviarDatos(ws: WebSocket): Promise<void> {
    try {
        const racimos = await obtenerTodosLosRacimos(); // Obtener datos desde la base de datos

        if (ws && ws.readyState === WebSocket.OPEN) {
            
            const dataToSend = JSON.stringify(racimos);
            ws.send(dataToSend);
        } else {
            console.error('El WebSocket no está disponible o no está abierto');
        }
    } catch (error) {
        console.error('Error al obtener datos desde la base de datos:', error);
    }
}

setInterval(() => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            obtenerYEnviarDatos(client);
        }
    });
}, 1000);

function desconectarWebSocket(): void {
    wss.close(() => {
        console.log('Servidor WebSocket desconectado');
    });
}

export { server, wss, conectarWebSocket, desconectarWebSocket };
