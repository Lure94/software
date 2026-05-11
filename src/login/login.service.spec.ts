import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { HashService } from '../hash/hash.service.js';

const mockHashService = {
  hash: jest.fn(),
  verify: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('LoginService', () => {
  let service: LoginService;
  let prisma: jest.Mocked<PrismaService>;
  let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: PrismaService,
          useValue: {
            usuario: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: HashService, useValue: mockHashService },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    prisma = module.get(PrismaService);
    hashService = module.get(HashService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('registerUser', () => {
    it('debería registrar un usuario con RegisterAuthDto válido', async () => {
      const dto: RegisterAuthDto = {
        Pnom: 'Laureano',
        Snom: 'Jose',
        Papellido: 'Villagra',
        Sapellido: 'Mendoza',
        Email: 'laureano@ejemplo.com',
        Password: 'passwordSeguro123',
        Telefono: '88887777',
      };

      hashService.hash.mockResolvedValue('hashed_password');

      const mockCreatedUser = {
        ID_USUARIO: '7f999999-e89b-12d3-a456-426614174000',
        Pnom: dto.Pnom,
        Snom: dto.Snom,
        Papellido: dto.Papellido,
        Sapellido: dto.Sapellido,
        Email: dto.Email,
        Password: 'hashed_password',
        Telefono: dto.Telefono,
        ID_Rol: 1,
        Creado_en: new Date(),
        Rol: {
          ID_Rol: 1,
          nomb_rol: 'user',
        },
      };

      prisma.usuario.create.mockResolvedValue(mockCreatedUser);

      const result = await service.registerUser(dto);

      expect(result.result).not.toHaveProperty('Password');
      expect(result.rol).toBe('user');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.usuario.create).toHaveBeenCalled();
    });
  });

  describe('registerUser', () => {
    it('debería arrojar un error cuando no se crea el usuario en la base de datos', async () => {
      const dto: RegisterAuthDto = {
        Pnom: 'Laureano',
        Snom: 'Jose',
        Papellido: 'Villagra',
        Sapellido: 'Mendoza',
        Email: '',
        Password: 'passwordSeguro123',
        Telefono: '88887777',
      };

      hashService.hash.mockResolvedValue('hashed_password');

      await expect(service.registerUser(dto)).rejects.toThrow(
        new Error('Error al crear el usuario en la base de datos'),
      );
    });
  });

  describe('loginUser', () => {
    it('debería fallar si LoginAuthDto tiene credenciales inexistentes', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(
        service.loginUser({
          Email: 'noexiste@test.com',
          Password: 'password123',
        }),
      ).rejects.toThrow(
        new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED),
      );
    });

    it('debería iniciar sesión con LoginAuthDto válido', async () => {
      const loginDto: LoginAuthDto = {
        Email: 'juan@test.com',
        Password: 'password123',
      };

      const mockUserInDb = {
        ID_USUARIO: '7f999999-e89b-12d3-a456-426614174000',
        Pnom: 'Juan',
        Snom: 'Alberto',
        Papellido: 'Perez',
        Sapellido: 'Lopez',
        Email: loginDto.Email,
        Password: loginDto.Password,
        Telefono: '88887777',
        ID_Rol: 1,
        Creado_en: new Date(),
        Rol: {
          ID_Rol: 1,
          nomb_rol: 'user',
        },
      };

      prisma.usuario.findUnique.mockResolvedValue(mockUserInDb);

      hashService.verify.mockResolvedValue(true);

      const result = await service.loginUser(loginDto);

      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe(loginDto.Email);
      expect(result.user.rol).toBe('user');
    });
  });
});
