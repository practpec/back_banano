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