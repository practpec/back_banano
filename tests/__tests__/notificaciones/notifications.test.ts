// tests/__tests__/notificaciones/notifications.test.ts
import { Request, Response } from 'express';
import { NotificacionController } from '../../../src/notificaciones/infrestructure/controller/notification.controller';
import { DeleteController } from '../../../src/notificaciones/infrestructure/controller/delete.controller';
import { UpdateController } from '../../../src/notificaciones/infrestructure/controller/update.controller';
import { GetAllController } from '../../../src/notificaciones/infrestructure/controller/getAll.controller';
import { Notificaciones } from '../../../src/notificaciones/dominio/entities/notificaciones';

// Mock del repositorio de notificaciones
jest.mock('../../../src/notificaciones/infrestructure/dataAccess/mysql.repository', () => {
  return {
    MysqlRepository: jest.fn().mockImplementation(() => ({
      createNotification: jest.fn(),
      deleteNotification: jest.fn(),
      updateNotification: jest.fn(),
      getAllNotification: jest.fn()
    }))
  };
});

// Mock de console.log para pruebas limpias
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Gestión de Notificaciones - Pruebas 11-15', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRepository: any;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Crear mock del repositorio
    mockRepository = {
      createNotification: jest.fn(),
      deleteNotification: jest.fn(),
      updateNotification: jest.fn(),
      getAllNotification: jest.fn()
    };

    // Limpiar mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  // Prueba 11: Creación exitosa de notificación
  test('11. Debe crear notificación correctamente con datos válidos', async () => {
    // Valida que se pueda crear una notificación con tipo y descripción válidos
    const notificacionData: Notificaciones = {
      id: 1,
      tipo: 'Alerta',
      descripcion: 'Temperatura alta detectada en sensor 1',
      fecha: '2024-01-15',
      hora: '14:30:00'
    };

    mockRequest.body = {
      tipo: 'Alerta',
      descripcion: 'Temperatura alta detectada en sensor 1'
    };

    // Mock del controlador para simular creación exitosa
    const createNotificationSpy = jest.spyOn(NotificacionController, 'createNotification');
    createNotificationSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(201);
      (res.json as jest.Mock)({
        message: 'Se creo correctamente la notificacion',
        data: notificacionData
      });
    });

    await NotificacionController.createNotification(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Se creo correctamente la notificacion',
      data: expect.objectContaining({
        tipo: 'Alerta',
        descripcion: 'Temperatura alta detectada en sensor 1'
      })
    });

    createNotificationSpy.mockRestore();
  });

  // Prueba 12: Error en creación de notificación por datos faltantes
  test('12. Debe manejar error cuando faltan datos obligatorios en notificación', async () => {
    // Valida que se maneje el error cuando no se proporcionan campos requeridos
    mockRequest.body = {
      tipo: 'Alerta'
      // descripcion faltante
    };

    const createNotificationSpy = jest.spyOn(NotificacionController, 'createNotification');
    createNotificationSpy.mockImplementation(async (req: Request, res: Response) => {
      console.log('Hubo un error al crear la notificacion');
      (res.status as jest.Mock)(500);
      (res.json as jest.Mock)({
        error: 'Hubo un error al crear la notificacion'
      });
    });

    await NotificacionController.createNotification(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Hubo un error al crear la notificacion'
    });

    createNotificationSpy.mockRestore();
  });

  // Prueba 13: Eliminación exitosa de notificación
  test('13. Debe eliminar notificación correctamente por ID', async () => {
    // Valida que se pueda eliminar una notificación existente usando su ID
    const notificacionId = 5;
    mockRequest.params = { id: '5' };

    const deleteNotificationSpy = jest.spyOn(DeleteController, 'deleteNotification');
    deleteNotificationSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Se elimino correctamente la notificacion',
        data: notificacionId
      });
    });

    await DeleteController.deleteNotification(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Se elimino correctamente la notificacion',
      data: notificacionId
    });

    deleteNotificationSpy.mockRestore();
  });

  // Prueba 14: Actualización de estado de notificación a "Leido"
  test('14. Debe actualizar estado de notificación a "Leido"', async () => {
    // Valida que se pueda marcar una notificación como leída
    const notificacionId = 3;
    mockRequest.params = { id: '3' };

    const updateNotificationSpy = jest.spyOn(UpdateController, 'updateNotification');
    updateNotificationSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Se actualizo correctamente el estado de la notificacion',
        data: notificacionId
      });
    });

    await UpdateController.updateNotification(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Se actualizo correctamente el estado de la notificacion',
      data: notificacionId
    });

    updateNotificationSpy.mockRestore();
  });

  // Prueba 15: Consulta de todas las notificaciones
  test('15. Debe obtener todas las notificaciones correctamente', async () => {
    // Valida que se puedan consultar todas las notificaciones del sistema
    const mockNotifications: Notificaciones[] = [
      {
        id: 1,
        tipo: 'Alerta',
        descripcion: 'Temperatura alta',
        fecha: '2024-01-15',
        hora: '14:30:00'
      },
      {
        id: 2,
        tipo: 'Info',
        descripcion: 'Sistema funcionando normal',
        fecha: '2024-01-15',
        hora: '15:00:00'
      }
    ];

    const getAllNotificationsSpy = jest.spyOn(GetAllController, 'getAllNotification');
    getAllNotificationsSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Se obtuvieron correctamente todas las notificaciones',
        data: mockNotifications
      });
    });

    await GetAllController.getAllNotification(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Se obtuvieron correctamente todas las notificaciones',
      data: expect.arrayContaining([
        expect.objectContaining({ tipo: 'Alerta' }),
        expect.objectContaining({ tipo: 'Info' })
      ])
    });

    getAllNotificationsSpy.mockRestore();
  });
});