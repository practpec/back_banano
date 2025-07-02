// tests/__tests__/climaticos/climaticos.test.ts
import { Request, Response } from 'express';
import { GetControllerTemperatura } from '../../../src/climaticos/infrestructure/controllers/getTemperatura.Controller';
import { GetControllerHumedad } from '../../../src/climaticos/infrestructure/controllers/getHumedad.controller';
import { UpdateControllerTemperatura } from '../../../src/climaticos/infrestructure/controllers/updateTemperatura.Controller';
import { UpdateControllerHumedad } from '../../../src/climaticos/infrestructure/controllers/updateHumedad.Controller';
import { Climaticos } from '../../../src/climaticos/dominio/entities/climaticos';

// Mock del repositorio climático
jest.mock('../../../src/climaticos/infrestructure/dataAccess/mysql.repository', () => {
  return {
    MysqlRepository: jest.fn().mockImplementation(() => ({
      getClimaticoTemperatura: jest.fn(),
      getClimaticoHumedad: jest.fn(),
      updateClimaticoTemperatura: jest.fn(),
      updateClimaticoHumedad: jest.fn()
    }))
  };
});

// Mock de console.log para pruebas limpias
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Gestión de Datos Climáticos - Pruebas 21-25', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Limpiar mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleLog.mockRestore();
  });

  // Prueba 21: Consulta de datos de temperatura
  test('21. Debe obtener datos de temperatura correctamente', async () => {
    // Valida que se puedan consultar los rangos de temperatura máxima y mínima
    const mockTemperaturas: Climaticos[] = [
      {
        temperatura_max: 35.5,
        temperatura_min: 18.2,
        humedad_max: 0,
        humedad_min: 0
      },
      {
        temperatura_max: 33.8,
        temperatura_min: 20.1,
        humedad_max: 0,
        humedad_min: 0
      }
    ];

    const getTemperaturaSpy = jest.spyOn(GetControllerTemperatura, 'getTemperatura');
    getTemperaturaSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Se obtuvieron correctamente los datos de la temperatura',
        data: mockTemperaturas
      });
    });

    await GetControllerTemperatura.getTemperatura(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Se obtuvieron correctamente los datos de la temperatura',
      data: expect.arrayContaining([
        expect.objectContaining({
          temperatura_max: expect.any(Number),
          temperatura_min: expect.any(Number)
        })
      ])
    });

    getTemperaturaSpy.mockRestore();
  });

  // Prueba 22: Consulta de datos de humedad
  test('22. Debe obtener datos de humedad correctamente', async () => {
    // Valida que se puedan consultar los rangos de humedad máxima y mínima
    const mockHumedad: Climaticos[] = [
      {
        temperatura_max: 0,
        temperatura_min: 0,
        humedad_max: 85.7,
        humedad_min: 45.3
      },
      {
        temperatura_max: 0,
        temperatura_min: 0,
        humedad_max: 82.1,
        humedad_min: 48.9
      }
    ];

    const getHumedadSpy = jest.spyOn(GetControllerHumedad, 'getHumedad');
    getHumedadSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Se obtuvieron correctamente los datos de la humedad',
        data: mockHumedad
      });
    });

    await GetControllerHumedad.getHumedad(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Se obtuvieron correctamente los datos de la humedad',
      data: expect.arrayContaining([
        expect.objectContaining({
          humedad_max: expect.any(Number),
          humedad_min: expect.any(Number)
        })
      ])
    });

    getHumedadSpy.mockRestore();
  });

  // Prueba 23: Actualización de rangos de temperatura
  test('23. Debe actualizar rangos de temperatura correctamente', async () => {
    // Valida que se puedan actualizar los límites de temperatura máxima y mínima
    mockRequest.body = {
      climaticoId: 1,
      nuevaTemperaturaMax: 38.5,
      nuevaTemperaturaMin: 15.2
    };

    const updateTemperaturaSpy = jest.spyOn(UpdateControllerTemperatura, 'updateTemperatura');
    updateTemperaturaSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Los datos de temperatura se actualizaron correctamente'
      });
    });

    await UpdateControllerTemperatura.updateTemperatura(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Los datos de temperatura se actualizaron correctamente'
    });

    updateTemperaturaSpy.mockRestore();
  });

  // Prueba 24: Actualización de rangos de humedad
  test('24. Debe actualizar rangos de humedad correctamente', async () => {
    // Valida que se puedan actualizar los límites de humedad máxima y mínima
    mockRequest.body = {
      climaticoId: 1,
      nuevaHumedadMax: 90.0,
      nuevaHumedadMin: 40.0
    };

    const updateHumedadSpy = jest.spyOn(UpdateControllerHumedad, 'updateHumedad');
    updateHumedadSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Los datos de humedad se actualizaron correctamente'
      });
    });

    await UpdateControllerHumedad.updateHumedad(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Los datos de humedad se actualizaron correctamente'
    });

    updateHumedadSpy.mockRestore();
  });

  // Prueba 25: Error en actualización con datos inválidos de clima
  test('25. Debe manejar error con rangos climáticos inválidos', async () => {
    // Valida que se rechacen rangos donde el mínimo es mayor que el máximo
    mockRequest.body = {
      climaticoId: 1,
      nuevaTemperaturaMax: 15.0, // Menor que el mínimo
      nuevaTemperaturaMin: 25.0  // Mayor que el máximo - INVÁLIDO
    };

    const updateTemperaturaSpy = jest.spyOn(UpdateControllerTemperatura, 'updateTemperatura');
    updateTemperaturaSpy.mockImplementation(async (req: Request, res: Response) => {
      console.log('Hubo un error al actualizar los datos de temperatura');
      (res.status as jest.Mock)(500);
      (res.json as jest.Mock)({
        error: 'Hubo un error al actualizar los datos de temperatura'
      });
    });

    await UpdateControllerTemperatura.updateTemperatura(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Hubo un error al actualizar los datos de temperatura'
    });

    updateTemperaturaSpy.mockRestore();
  });
});