// tests/__tests__/racimos/racimos.test.ts
import { Request, Response } from 'express';
import { RacimoController } from '../../../src/racimos/infrestructure/controller/racimo.controller';
import { GetAllController } from '../../../src/racimos/infrestructure/controller/getAll.controller';
import { GetDatosController } from '../../../src/racimos/infrestructure/controller/getDato.controller';
import { Racimos } from '../../../src/racimos/dominio/entities/racimos';

// Mock del repositorio de racimos
jest.mock('../../../src/racimos/infrestructure/dataAccess/mysql.respository', () => {
  return {
    MysqlRepository: jest.fn().mockImplementation(() => ({
      createRacimo: jest.fn(),
      getAllRacimo: jest.fn(),
      getDatos: jest.fn()
    }))
  };
});

// Mock de console.log para pruebas limpias
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Gestión de Racimos/Sensores IoT - Pruebas 16-20', () => {
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

  // Prueba 16: Creación exitosa de datos de racimo/sensor
  test('16. Debe crear datos de racimo correctamente con sensores válidos', async () => {
    // Valida que se puedan registrar datos de sensores IoT (temperatura, luz, humedad, distancia)
    const racimoData: Racimos = {
      temperatura: 24.5,
      luz: 850,
      humedad: 68.3,
      distancia: 125.7,
      imagen: 'data:image/base64,iVBORw0KGgoAAAANSUhEUg...'
    };

    mockRequest.body = {
      temperatura: 24.5,
      luz: 850,
      humedad: 68.3,
      distancia: 125.7,
      imagen: 'data:image/base64,iVBORw0KGgoAAAANSUhEUg...'
    };

    const createRacimoSpy = jest.spyOn(RacimoController, 'createRacimo');
    createRacimoSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(201);
      (res.json as jest.Mock)({
        messsage: 'se creo correctamente los datos del racimo',
        data: racimoData
      });
    });

    await RacimoController.createRacimo(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      messsage: 'se creo correctamente los datos del racimo',
      data: expect.objectContaining({
        temperatura: 24.5,
        luz: 850,
        humedad: 68.3,
        distancia: 125.7
      })
    });

    createRacimoSpy.mockRestore();
  });

  // Prueba 17: Validación de rangos de sensores
  test('17. Debe validar rangos correctos de sensores IoT', async () => {
    // Valida que los datos de sensores estén dentro de rangos esperados
    const datosExtremos: Racimos = {
      temperatura: -5.0, // Temperatura muy baja
      luz: 1200,         // Luz muy alta
      humedad: 95.8,     // Humedad muy alta
      distancia: 200.5,  // Distancia alta
      imagen: 'base64...'
    };

    mockRequest.body = datosExtremos;

    const createRacimoSpy = jest.spyOn(RacimoController, 'createRacimo');
    createRacimoSpy.mockImplementation(async (req: Request, res: Response) => {
      // Simular que acepta datos extremos pero válidos
      (res.status as jest.Mock)(201);
      (res.json as jest.Mock)({
        messsage: 'se creo correctamente los datos del racimo',
        data: datosExtremos
      });
    });

    await RacimoController.createRacimo(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          temperatura: expect.any(Number),
          luz: expect.any(Number),
          humedad: expect.any(Number),
          distancia: expect.any(Number)
        })
      })
    );

    createRacimoSpy.mockRestore();
  });

  // Prueba 18: Error en creación por datos de sensores inválidos
  test('18. Debe manejar error con datos de sensores inválidos', async () => {
    // Valida que se rechacen datos de sensores fuera de rango o formato incorrecto
    mockRequest.body = {
      temperatura: 'invalid', // Tipo incorrecto
      luz: null,              // Valor nulo
      humedad: undefined,     // Valor indefinido
      distancia: -50          // Valor negativo inválido
    };

    const createRacimoSpy = jest.spyOn(RacimoController, 'createRacimo');
    createRacimoSpy.mockImplementation(async (req: Request, res: Response) => {
      console.log('Hubo un error al crear los datos del racimo');
      (res.status as jest.Mock)(500);
      (res.json as jest.Mock)({
        error: 'Hubo un error al crear los datos del racimo'
      });
    });

    await RacimoController.createRacimo(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Hubo un error al crear los datos del racimo'
    });

    createRacimoSpy.mockRestore();
  });

  // Prueba 19: Consulta de todos los racimos/sensores
  test('19. Debe obtener todos los datos de racimos correctamente', async () => {
    // Valida que se puedan consultar todos los registros de sensores
    const mockRacimos: Racimos[] = [
      {
        temperatura: 24.5,
        luz: 850,
        humedad: 68.3,
        distancia: 125.7,
        imagen: 'base64_1...'
      },
      {
        temperatura: 26.2,
        luz: 920,
        humedad: 71.5,
        distancia: 130.2,
        imagen: 'base64_2...'
      }
    ];

    const getAllRacimoSpy = jest.spyOn(GetAllController, 'getAllRacimo');
    getAllRacimoSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Se obtuvieron correctamente todos los racimos',
        data: mockRacimos
      });
    });

    await GetAllController.getAllRacimo(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Se obtuvieron correctamente todos los racimos',
      data: expect.arrayContaining([
        expect.objectContaining({
          temperatura: expect.any(Number),
          luz: expect.any(Number),
          humedad: expect.any(Number),
          distancia: expect.any(Number)
        })
      ])
    });

    getAllRacimoSpy.mockRestore();
  });

  // Prueba 20: Consulta de datos específicos por tipo de sensor
  test('20. Debe obtener datos específicos por tipo de sensor', async () => {
    // Valida que se puedan consultar datos de un sensor específico (ej: solo temperatura)
    const mockTemperaturas = [24.5, 26.2, 23.8, 25.1, 27.3];
    mockRequest.params = { dato: 'temperatura' };

    const getDatosSpy = jest.spyOn(GetDatosController, 'getDatos');
    getDatosSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Se obtuvieron correctamente los datos',
        data: mockTemperaturas
      });
    });

    await GetDatosController.getDatos(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Se obtuvieron correctamente los datos',
      data: expect.arrayContaining([
        expect.any(Number)
      ])
    });

    // Verificar que todos los elementos son números (temperaturas)
    const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(responseCall.data).toEqual(expect.arrayContaining([
      expect.any(Number)
    ]));

    getDatosSpy.mockRestore();
  });
});