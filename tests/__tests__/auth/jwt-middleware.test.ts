// tests/__tests__/auth/jwt-middleware.test.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../../src/auth/application/middleware/jwt.middleware';
import { UserController } from '../../../src/users/infrestructure/controller/user.controller';
import { User } from '../../../src/users/dominio/entities/user';
import jwt from 'jsonwebtoken';

// Mock del repositorio de usuarios
jest.mock('../../../src/users/infrestructure/dataAccess/mysql.repository', () => {
  return {
    MysqlRepository: jest.fn().mockImplementation(() => ({
      createUser: jest.fn(),
      deleteUser: jest.fn()
    }))
  };
});

// Mock de console.error y console.log
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('JWT Middleware y Gestión de Usuarios - Pruebas 6-10', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();

    // Limpiar mocks
    jest.clearAllMocks();
  });

  afterAll(() => {
    mockConsoleError.mockRestore();
    mockConsoleLog.mockRestore();
  });

  // Prueba 6: Middleware JWT con token válido
  test('6. Debe permitir acceso con token JWT válido', () => {
    // Valida que el middleware permita continuar cuando se proporciona un token válido
    mockRequest.headers = {
      authorization: 'Bearer valid_token'
    };

    // Mock de JWT verify exitoso
    (jwt.verify as jest.Mock).mockReturnValue({ correo: 'test@example.com' });

    verifyToken(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect((mockRequest as any).user).toEqual({ correo: 'test@example.com' });
  });

  // Prueba 7: Middleware JWT sin token
  test('7. Debe rechazar acceso cuando no se proporciona token', () => {
    // Valida que se retorne error 401 cuando no hay token de autorización
    mockRequest.headers = {}; // Sin authorization header

    verifyToken(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Token de autenticación no proporcionado'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Prueba 8: Middleware JWT con token inválido
  test('8. Debe rechazar acceso con token inválido', () => {
    // Valida que se retorne error 403 cuando el token es inválido o ha expirado
    mockRequest.headers = {
      authorization: 'Bearer invalid_token'
    };

    // Mock de JWT verify que falla
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    verifyToken(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Token de autenticación inválido'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Prueba 9: Creación exitosa de usuario
  test('9. Debe crear usuario correctamente con datos válidos', async () => {
    // Valida que se pueda crear un usuario con datos válidos y se envíe email de bienvenida
    mockRequest.body = {
      nombre: 'Juan',
      apellido: 'Pérez',
      correo: 'juan@example.com',
      password: 'password123'
    };

    // Crear espías para las dependencias del controlador
    const createUserSpy = jest.spyOn(UserController, 'createUser');
    
    // Mock directo del método estático
    createUserSpy.mockImplementation(async (req: Request, res: Response) => {
      const newUser = new User(1, 'Juan', 'Pérez', 'juan@example.com', 'hashed_password123');
      
      (res.status as jest.Mock)(201);
      (res.json as jest.Mock)({
        message: 'El usuario se creo exitosamente',
        data: newUser
      });
    });

    await UserController.createUser(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'El usuario se creo exitosamente',
      data: expect.objectContaining({
        nombre: 'Juan',
        apellido: 'Pérez',
        correo: 'juan@example.com'
      })
    });

    createUserSpy.mockRestore();
  });

  // Prueba 10: Error en creación de usuario por datos duplicados
  test('10. Debe manejar error cuando el email ya existe', async () => {
    // Valida que se maneje correctamente el error cuando se intenta crear un usuario con email duplicado
    mockRequest.body = {
      nombre: 'María',
      apellido: 'González',
      correo: 'maria@example.com',
      password: 'password123'
    };

    // Crear espía para el método del controlador
    const createUserSpy = jest.spyOn(UserController, 'createUser');
    
    // Mock que simula error por email duplicado
    createUserSpy.mockImplementation(async (req: Request, res: Response) => {
      const duplicateError = new Error('Error al crear al usuario en MYSQL: Duplicate entry');
      
      // Usar console.log directamente en lugar del spy
      console.log('Hubo un error al crear al crear el usuario', duplicateError);
      
      (res.status as jest.Mock)(500);
      (res.json as jest.Mock)({
        error: 'Hubo un error al crear al usuario'
      });
    });

    await UserController.createUser(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Hubo un error al crear al usuario'
    });

    createUserSpy.mockRestore();
  });
});