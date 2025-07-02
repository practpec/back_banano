// tests/utils/test-helpers.ts
import { Request, Response } from 'express';

export const createMockRequest = (body?: any, params?: any, headers?: any, query?: any): Partial<Request> => {
  return {
    body: body || {},
    params: params || {},
    headers: headers || {},
    query: query || {}
  };
};

export const createMockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

export const createMockNext = (): jest.Mock => {
  return jest.fn();
};

// Datos de prueba comunes
export const mockUsers = {
  validUser: {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    correo: 'juan@example.com',
    password: 'hashed_password123'
  },
  newUser: {
    nombre: 'María',
    apellido: 'González',
    correo: 'maria@example.com',
    password: 'password123'
  }
};

export const mockNotifications = {
  validNotification: {
    id: 1,
    tipo: 'Alerta',
    descripcion: 'Temperatura alta detectada',
    fecha: '2024-01-15',
    hora: '14:30:00'
  },
  newNotification: {
    tipo: 'Info',
    descripcion: 'Sistema funcionando correctamente',
    fecha: '2024-01-15',
    hora: '15:00:00'
  }
};

export const mockRacimos = {
  validRacimo: {
    id: 1,
    temperatura: 25.5,
    luz: 850,
    humedad: 65.2,
    distancia: 120.5,
    imagen: 'base64string...'
  },
  newRacimo: {
    temperatura: 23.8,
    luz: 900,
    humedad: 70.1,
    distancia: 115.2,
    imagen: 'base64string2...'
  }
};

// Utilidad para limpiar mocks
export const clearAllMocks = () => {
  jest.clearAllMocks();
};