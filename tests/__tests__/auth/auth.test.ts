// tests/__tests__/auth/auth.test.ts
import { Request, Response } from 'express';
import { AuthController } from '../../../src/auth/infrestructure/controller/auth.user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock completo del módulo de repositorio
jest.mock('../../../src/auth/infrestructure/myslRepository/myql.repository', () => {
  return {
    MysqlRepository: jest.fn().mockImplementation(() => ({
      getUserByEmail: jest.fn()
    }))
  };
});

// Mock de console.error para pruebas limpias
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('Autenticación y Autorización - Pruebas 1-5', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockRepository: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Crear mock del repositorio
    mockRepository = {
      getUserByEmail: jest.fn()
    };

    // Asignar el mock al controlador
    (AuthController as any).mysqlRepository = mockRepository;

    // Limpiar mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
  });

  // Prueba 1: Login exitoso con credenciales válidas
  test('1. Debe autenticar correctamente con credenciales válidas', async () => {
    // Valida que un usuario con email y contraseña correctos pueda hacer login y recibir un JWT
    mockRequest.body = {
      correo: 'test@example.com',
      password: 'correctPassword'
    };

    // Mock de usuario encontrado en BD
    mockRepository.getUserByEmail.mockResolvedValue([
      [{ password: 'hashed_correctPassword' }]
    ]);

    // Mock de bcrypt compare exitoso
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Mock de JWT sign
    (jwt.sign as jest.Mock).mockReturnValue('valid_jwt_token');

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'El acceso fue correcto',
      token: 'valid_jwt_token'
    });
  });

  // Prueba 2: Login fallido con usuario inexistente
  test('2. Debe fallar el login cuando el usuario no existe', async () => {
    // Valida que se retorne error 404 cuando el email no está registrado
    mockRequest.body = {
      correo: 'noexiste@example.com',
      password: 'password123'
    };

    // Mock de usuario no encontrado
    mockRepository.getUserByEmail.mockResolvedValue(null);

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Usuario no encontrado'
    });
  });

  // Prueba 3: Login fallido con contraseña incorrecta
  test('3. Debe fallar el login con contraseña incorrecta', async () => {
    // Valida que se retorne error 401 cuando la contraseña no coincide
    mockRequest.body = {
      correo: 'test@example.com',
      password: 'wrongPassword'
    };

    // Mock de usuario encontrado
    mockRepository.getUserByEmail.mockResolvedValue([
      [{ password: 'hashed_correctPassword' }]
    ]);

    // Mock de bcrypt compare fallido
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Contraseña incorrecta'
    });
  });

  // Prueba 4: Login con campos faltantes
  test('4. Debe manejar error cuando faltan campos obligatorios', async () => {
    // Valida que se maneje correctamente cuando no se envían email o password
    mockRequest.body = {
      correo: 'test@example.com'
      // password faltante
    };

    // Mock de error en la consulta por datos incompletos
    mockRepository.getUserByEmail.mockRejectedValue(new Error('Datos incompletos'));

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error en la autenticación'
    });
  });

  // Prueba 5: Error de conexión a base de datos durante login
  test('5. Debe manejar error de conexión a la base de datos', async () => {
    // Valida que se maneje correctamente un error de conexión a la BD
    mockRequest.body = {
      correo: 'test@example.com',
      password: 'password123'
    };

    // Mock de error de conexión
    mockRepository.getUserByEmail.mockRejectedValue(new Error('Database connection failed'));

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error en la autenticación'
    });
  });
});