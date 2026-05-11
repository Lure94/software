import { CurrentUser } from './current-user.decorator.js';
import { ExecutionContext } from '@nestjs/common';
import { describe, it, expect } from '@jest/globals';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants.js';

function getParamDecoratorFactory(decorator: any) {
  class Test {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-call
    test(@decorator() value: any) {}
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  return args[Object.keys(args)[0]].factory;
}

describe('CurrentUser Decorator', () => {
  it('debería extraer el usuario del objeto request', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const factory = getParamDecoratorFactory(CurrentUser);

    const mockUser = {
      sub: 'uuid-123',
      email: 'laureano@ejemplo.com',
      rol: 'admin',
    };

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: mockUser,
        }),
      }),
    } as unknown as ExecutionContext;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const result = factory(null, mockContext);

    expect(result).toEqual(mockUser);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(result.email).toBe('laureano@ejemplo.com');
  });
});
