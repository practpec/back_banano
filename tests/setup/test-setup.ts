// tests/setup/test-setup.ts
import { jest } from '@jest/globals';

// Mock de la base de datos
jest.mock('../../src/database/db.config', () => ({
  query: jest.fn()
}));

// Mock de bcrypt
jest.mock('bcrypt', () => ({
  hashSync: jest.fn((password: string) => `hashed_${password}`),
  compareSync: jest.fn((password: string, hash: string) => password === 'correctPassword'),
  compare: jest.fn((password: string, hash: string) => 
    Promise.resolve(password === 'correctPassword')
  )
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock_jwt_token'),
  verify: jest.fn((token: string) => {
    if (token === 'valid_token') {
      return { correo: 'test@example.com' };
    }
    throw new Error('Invalid token');
  })
}));

// Mock de nodemailer
jest.mock('nodemailer', () => ({
  createTransporter: jest.fn(() => ({
    sendMail: jest.fn(() => Promise.resolve({ messageId: 'test-message-id' }))
  }))
}));

// Variables globales para testing
global.beforeEach(() => {
  jest.clearAllMocks();
});