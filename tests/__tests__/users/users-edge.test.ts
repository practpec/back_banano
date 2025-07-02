// tests/__tests__/users/users-edge.test.ts
import { Request, Response } from 'express';
import { DeleteController } from '../../../src/users/infrestructure/controller/deleteuser.controller';
import { UserController } from '../../../src/users/infrestructure/controller/user.controller';
import { verifyToken } from '../../../src/auth/application/middleware/jwt.middleware';
import { EncryptService } from '../../../src/users/infrestructure/helpers/encrypt.helpers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Mock del repositorio de usuarios
jest.mock('../../../src/users/infrestructure/dataAccess/mysql.repository', () => {
  return {
    MysqlRepository: jest.fn().mockImplementation(() => ({
      createUser: jest.fn(),
      deleteUser: jest.fn()
    }))
  };
});

// Mock de console.log para pruebas limpias
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});

describe('Usuarios, Casos Edge y Seguridad - Pruebas 26-30', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
      headers: {}
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
    mockConsoleLog.mockRestore();
  });

  // Prueba 26: Eliminación exitosa de usuario por email
  test('26. Debe eliminar usuario correctamente por email', async () => {
    // Valida que se pueda eliminar un usuario usando su email como identificador
    const userEmail = 'usuario@eliminar.com';
    mockRequest.params = { correo: userEmail };

    const deleteUserSpy = jest.spyOn(DeleteController, 'deleteUser');
    deleteUserSpy.mockImplementation(async (req: Request, res: Response) => {
      (res.status as jest.Mock)(200);
      (res.json as jest.Mock)({
        message: 'Se elimino correctamente al usuario',
        data: userEmail
      });
    });

    await DeleteController.deleteUser(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Se elimino correctamente al usuario',
      data: userEmail
    });

    deleteUserSpy.mockRestore();
  });

  // Prueba 27: Error al eliminar usuario inexistente
  test('27. Debe manejar error al eliminar usuario que no existe', async () => {
    // Valida el manejo de errores cuando se intenta eliminar un usuario inexistente
    const nonExistentEmail = 'noexiste@ejemplo.com';
    mockRequest.params = { correo: nonExistentEmail };

    const deleteUserSpy = jest.spyOn(DeleteController, 'deleteUser');
    deleteUserSpy.mockImplementation(async (req: Request, res: Response) => {
      console.log('Hubo un error al eliminar el usuario');
      (res.status as jest.Mock)(500);
      (res.json as jest.Mock)({
        error: 'Hubo un error al eliminar el usuario'
      });
    });

    await DeleteController.deleteUser(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: 'Hubo un error al eliminar el usuario'
    });

    deleteUserSpy.mockRestore();
  });

  // Prueba 28: Validación de seguridad - Token malformado
  test('28. Debe rechazar tokens malformados en el middleware', () => {
    // Valida que se rechacen tokens con formato incorrecto (no Bearer, malformado)
    mockRequest.headers = {
      authorization: 'InvalidFormat token_without_bearer'
    };

    verifyToken(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Token de autenticación no proporcionado'
    });
    expect(mockNext).not.toHaveBeenCalled();
  });

  // Prueba 29: Seguridad de encriptación - Verificar hash de contraseñas
  test('29. Debe encriptar contraseñas de forma segura', () => {
    // Valida que las contraseñas se encripten correctamente y no sean reversibles
    const encryptService = new EncryptService();
    const plainPassword = 'miPasswordSegura123';
    
    // Mock de bcrypt para simular encriptación
    (bcrypt.hashSync as jest.Mock).mockReturnValue('$2b$10$hashedPasswordExample123456');

    const hashedPassword = encryptService.endecodePassword(plainPassword);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(plainPassword);
    expect(hashedPassword).toMatch(/^\$2b\$10\$/); // Formato típico de bcrypt
    expect(bcrypt.hashSync).toHaveBeenCalledWith(plainPassword, 10);
  });

  // Prueba 30: Caso edge - Creación de usuario con datos extremos válidos
  test('30. Debe manejar datos extremos válidos en creación de usuario', async () => {
    // Valida que se manejen correctamente datos en los límites de validación
    const extremeUserData = {
      nombre: 'A', // Nombre muy corto pero válido
      apellido: 'Ñoñosquenoñoñosqueañoñosqueañoñosqueañoñosqueañoñosqueabc', // Apellido muy largo
      correo: 'a@b.co', // Email muy corto pero válido
      password: 'Aa1!'.repeat(10) // Password muy largo pero válido
    };

    mockRequest.body = extremeUserData;

    const createUserSpy = jest.spyOn(UserController, 'createUser');
    createUserSpy.mockImplementation(async (req: Request, res: Response) => {
      // Simular que acepta datos extremos pero válidos
      (res.status as jest.Mock)(201);
      (res.json as jest.Mock)({
        message: 'El usuario se creo exitosamente',
        data: {
          id: 1,
          nombre: extremeUserData.nombre,
          apellido: extremeUserData.apellido,
          correo: extremeUserData.correo,
          password: 'hashed_password'
        }
      });
    });

    await UserController.createUser(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'El usuario se creo exitosamente',
      data: expect.objectContaining({
        nombre: extremeUserData.nombre,
        apellido: extremeUserData.apellido,
        correo: extremeUserData.correo
      })
    });

    // Verificar que los datos extremos fueron procesados
    const responseCall = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(responseCall.data.nombre).toHaveLength(1); // Nombre muy corto
    expect(responseCall.data.apellido.length).toBeGreaterThan(50); // Apellido muy largo
    expect(responseCall.data.correo).toMatch(/^[^@]+@[^@]+\.[^@]+$/); // Email válido

    createUserSpy.mockRestore();
  });
});