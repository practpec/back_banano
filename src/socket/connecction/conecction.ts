import WebSocket from "ws";
import http from 'http';
import { obtenerTodosLosRacimos } from "../service/optener.racimos";
import { Racimos } from '../../racimos/dominio/entities/racimos'; 

const server = http.createServer();
const wss = new WebSocket.Server({ port: 4000 });

let racimosBuffer: Racimos[] | null = null;

// Intervalo de tiempo para enviar el buffer (en milisegundos)
const bufferInterval = 10000; 

function conectarWebSocket(): void {
    wss.on('connection', (ws: WebSocket) => {
        console.log('Nuevo cliente conectado con WebSocket');

        ws.on('close', () => {
            console.log('Cliente desconectado de WebSocket');
        });


        
        // Si hay datos en el buffer, enviarlos al cliente recién conectado
        if (racimosBuffer) {
            ws.send(JSON.stringify(racimosBuffer));
        }
        obtenerTodosLosRacimos();
    });
}

async function obtenerYEnviarDatos(): Promise<void> {
    try {
        const racimos = await obtenerTodosLosRacimos(); 

        // Almacenar los datos en el buffer
        racimosBuffer = racimos;

        // Reiniciar el buffer después de un intervalo de tiempo
        setTimeout(() => {
            racimosBuffer = null;
        }, bufferInterval);

        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(racimos));
            }
        });
    } catch (error) {
        console.error('Error al obtener datos desde la base de datos:', error);
    }
}

setInterval(obtenerYEnviarDatos, bufferInterval);

function desconectarWebSocket(): void {
    wss.close(() => {
        console.log('Servidor WebSocket desconectado');
    });
}

export { server, wss, conectarWebSocket, desconectarWebSocket };
