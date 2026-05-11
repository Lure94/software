import { Test, TestingModule } from '@nestjs/testing';
import { CourierController } from './courier.controller.js';
import { CourierService } from './courier.service.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('CourierController', () => {
  let controller: CourierController;
  let service: jest.Mocked<CourierService>;

  const mockUserPayload = {
    user: { email: 'mensajero@test.com', rol: 'mensajero' },
    sub: 'uuid-user-123',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourierController],
      providers: [
        {
          provide: CourierService,
          useValue: {
            getMyPackages: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CourierController>(CourierController);
    service = module.get(CourierService);
  });

  describe('getMyPackages', () => {
    it('debería llamar al servicio con el email del mensajero autenticado', async () => {
      const mockResult = [{ id_paquete: 1, tracking: 'GPS-1' }];
      service.getMyPackages.mockResolvedValue(mockResult as any);

      const result = await controller.getMyPackages(mockUserPayload as any);

      expect(service.getMyPackages).toHaveBeenCalledWith('mensajero@test.com');
      expect(result).toEqual(mockResult);
    });
  });
});
