import 'reflect-metadata';
import { Roles, ROLES_KEY, AppRole } from './roles.decorator.js';
import { Reflector } from '@nestjs/core';
import { describe, it, expect } from '@jest/globals';

describe('Roles Decorator', () => {
  const reflector = new Reflector();

  it('debería añadir los roles correctos como metadata a una clase', () => {
    const roles = [AppRole.ADMIN];

    @Roles(...roles)
    class TestClass {}

    const metadata = reflector.get<AppRole[]>(ROLES_KEY, TestClass);

    expect(metadata).toEqual(roles);
  });

  it('debería añadir metadata a un método de clase', () => {
    const roles = [AppRole.MANAGER];

    class TestController {
      @Roles(...roles)
      testMethod() {}
    }

    const metadata = reflector.get<AppRole[]>(
      ROLES_KEY,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      TestController.prototype.testMethod,
    );

    expect(metadata).toEqual(roles);
  });
});
