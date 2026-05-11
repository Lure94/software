import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller.js';
import { LoginService } from './login.service.js';
import { ThrottlerGuard } from '@nestjs/throttler';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';

describe('LoginController', () => {
  let controller: LoginController;
  let service: jest.Mocked<LoginService>;

  const mockLoginService = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: LoginService,
          useValue: mockLoginService,
        },
      ],
    })

      .overrideGuard(ThrottlerGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<LoginController>(LoginController);
    service = module.get(LoginService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('debería llamar a loginService.registerUser con el DTO correcto', async () => {
      const registerDto: RegisterAuthDto = {
        Pnom: 'Juan',
        Snom: 'A',
        Papellido: 'Perez',
        Sapellido: 'L',
        Email: 'juan@test.com',
        Password: 'password123',
        Telefono: '88887777',
      };

      const expectedResponse = { result: { id: '1' }, rol: 'user' };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      service.registerUser.mockResolvedValue(expectedResponse as any);

      const result = await controller.register(registerDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.registerUser).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('debería llamar a loginService.loginUser y devolver el token', async () => {
      const loginDto: LoginAuthDto = {
        Email: 'juan@test.com',
        Password: 'password123',
      };

      const expectedResponse = {
        user: { nombre: 'Juan', email: 'juan@test.com', rol: 'user' },
        token: 'jwt-token-fake',
      };

      service.loginUser.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.loginUser).toHaveBeenCalledWith(loginDto);
      expect(result).toBe(expectedResponse);
    });
  });
});
