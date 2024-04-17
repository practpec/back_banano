import WebSocket from 'ws';
import http from 'http';

const server = http.createServer();
const wss = new WebSocket.Server({ port: 4000 });

export const clients: Set<WebSocket> = new Set();

// Conexión con WebSocket
function conectarWebSocket(): void {
    wss.on('connection', (ws: WebSocket) => {
        console.log('Nuevo cliente conectado con WebSocket');

        clients.add(ws);

        ws.on('close', () => {
            console.log('Cliente desconectado de WebSocket');
            clients.delete(ws);
        });
    });
}

// Desconexión de WebSocket
function desconectarWebSocket(): void {
    wss.close(() => {
        console.log('Servidor WebSocket desconectado');
    });
}

export { server, wss, conectarWebSocket, desconectarWebSocket };






import WebSocket from 'ws';
import http from 'http';
import jwt from 'jsonwebtoken';
import { SECRET_JWT } from '../auth/dominio/constants/secret';
const server = http.createServer();
const wss = new WebSocket.Server({ port: 4000 });

const clients = new Set();



// Función para verificar el token JWT
function verifyToken(token: any) {
    try {
        const decoded = jwt.verify(token, SECRET_JWT);
        return decoded;
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return null;
    }
}

// Conexión con WebSocket
function conectarWebSocket(): void {
    wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
        console.log('Nueva conexión WebSocket');

        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            console.log('Token de autenticación no proporcionado');
            ws.close();
            return;
        }

        const token = authorizationHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            console.log('Token de autenticación inválido');
            ws.close();
            return;
        }

        // Asignar la información del usuario decodificado al WebSocket si es necesario
        //(ws as any).user = decoded;

        clients.add(ws);

        ws.on('close', () => {
            console.log('Cliente desconectado de WebSocket');
            clients.delete(ws);
        });
    });
}

// Desconexión de WebSocket
function desconectarWebSocket(): void {
    wss.close(() => {
        console.log('Servidor WebSocket desconectado');
    });
}

export { server, wss, conectarWebSocket, desconectarWebSocket };



import WebSocket from 'ws';
import http from 'http';
import { RacimoApplication } from "../racimos/application/useCases/racimo.application";
import { MysqlRepository } from "../racimos/infrestructure/dataAccess/mysql.respository";
import { Racimos } from '../racimos/dominio/entities/racimos';

const server = http.createServer();
const wss = new WebSocket.Server({ port: 4000 });

const mysqlRepository = new MysqlRepository();
const racimoAppService = new RacimoApplication(mysqlRepository);

// Función para obtener todos los racimos desde la base de datos
async function obtenerTodosLosRacimos(): Promise<Racimos[] | null> {
    try {
        const racimos = await racimoAppService.getAllRacimo();
        return racimos;
    } catch (error) {
        console.error('Hubo un error al obtener los racimos', error);
        throw new Error('Hubo un error al obtener los racimos');
    }
}

const clients: Set<WebSocket> = new Set();

// Conexión con WebSocket
wss.on('connection', (ws: WebSocket) => {
    console.log('Nuevo cliente conectado con WebSocket');

    clients.add(ws);

    ws.on('close', () => {
        console.log('Cliente desconectado de WebSocket');
        clients.delete(ws);
    });
});

// Función para obtener datos desde la base de datos y emitirlos a todos los clientes
async function obtenerYEnviarDatos(): Promise<void> {
    try {
        const racimos = await obtenerTodosLosRacimos(); // Obtener datos desde la base de datos

        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(racimos));
            }
        });
    } catch (error) {
        console.error('Error al obtener datos desde la base de datos:', error);
    }
}

// Desconexión de WebSocket
function desconectarWebSocket(): void {
    wss.close(() => {
        console.log('Servidor WebSocket desconectado');
    });
}



// Llama a la función para obtener y enviar datos cada cierto intervalo de tiempo
setInterval(obtenerYEnviarDatos, 5000); // Por ejemplo, cada 5 segundos
