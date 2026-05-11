import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('UserController', () => {
  let controller: UserController;
  let service: jest.Mocked<UserService>;

  const mockUserPayload = {
    user: {
      email: 'laureano@ejemplo.com',
      rol: 'admin',
    },
    sub: 'uuid-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            addAddress: jest.fn(),
            getMyAddress: jest.fn(),
            trackPaquete: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  describe('addAddress', () => {
    it('debería llamar al servicio con el email extraído del payload', async () => {
      const dto = {
        calle: 'Altamira',
        ciudad: 'Managua',
        departamento: 'Managua',
        codigoPostal: '111',
        pais: 'Nicaragua',
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await controller.addAddress(mockUserPayload as any, dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.addAddress).toHaveBeenCalledWith(
        mockUserPayload.user.email,
        dto,
      );
    });
  });

  describe('trackPaquete', () => {
    it('debería pasar el código del paquete al servicio', async () => {
      const codigo = 'ABC-123';
      await controller.trackPaquete(codigo);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.trackPaquete).toHaveBeenCalledWith(codigo);
    });
  });
});
