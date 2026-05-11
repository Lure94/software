import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard.js';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Reflector>;

  // Mock del ExecutionContext
  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
    getHandler: jest.fn(),
    getClass: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('debería retornar true si no hay roles definidos en el decorador', () => {
    reflector.getAllAndOverride.mockReturnValue(null);

    const result = guard.canActivate(
      mockExecutionContext as unknown as ExecutionContext,
    );
    expect(result).toBe(true);
  });

  it('debería retornar true si el usuario tiene el rol requerido', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);

    mockExecutionContext.getRequest.mockReturnValue({
      user: { sub: '1', email: 'admin@test.com', rol: 'admin' },
    });

    const result = guard.canActivate(
      mockExecutionContext as unknown as ExecutionContext,
    );
    expect(result).toBe(true);
  });

  it('debería retornar false si el usuario NO tiene el rol requerido', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);
    mockExecutionContext.getRequest.mockReturnValue({
      user: { sub: '2', email: 'user@test.com', rol: 'user' },
    });

    const result = guard.canActivate(
      mockExecutionContext as unknown as ExecutionContext,
    );
    expect(result).toBe(false);
  });

  it('debería retornar false si no hay un usuario en la request', () => {
    reflector.getAllAndOverride.mockReturnValue(['admin']);
    mockExecutionContext.getRequest.mockReturnValue({
      user: undefined,
    });

    const result = guard.canActivate(
      mockExecutionContext as unknown as ExecutionContext,
    );
    expect(result).toBe(false);
  });
});
