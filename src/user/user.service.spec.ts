import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotFoundException } from '@nestjs/common';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { CreateDireccionDto } from './dto/create-direcicon.dto.js';

describe('UserService', () => {
  let service: UserService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            direccion: { create: jest.fn(), findMany: jest.fn() },
            paquete: { findFirst: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get(PrismaService);
  });

  describe('addAddress', () => {
    it('debería crear una dirección vinculada al email del usuario', async () => {
      const email = 'test@test.com';
      const dto: CreateDireccionDto = {
        calle: 'Calle Principal',
        ciudad: 'Managua',
        departamento: 'Managua',
        codigoPostal: '12000',
        pais: 'Nicaragua',
      };

      (prisma.direccion.create as jest.Mock).mockResolvedValue({
        id: 1,
        ...dto,
      });

      const result = await service.addAddress(email, dto);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prisma.direccion.create).toHaveBeenCalledWith({
        data: {
          USUARIO: { connect: { Email: email } },
          Calle_: dto.calle,
          Ciudad: dto.ciudad,
          State_departamento_: dto.departamento,
          Codigo_Postal: dto.codigoPostal,
          Pais: dto.pais,
          Creado_en: expect.any(Date),
        },
      });
      expect(result).toHaveProperty('id');
    });
  });

  describe('trackPaquete', () => {
    const codigoGps = 'GPS-123';

    it('debería retornar el seguimiento completo si el paquete existe y tiene GPS', async () => {
      const mockPaquete = {
        Codigo_gps: codigoGps,
        n_Receptor: 'Laureano',
        Estados: { n_Estado: 'En Camino' },
        Seguimiento_GPS: [
          {
            Latitud: '12.1328',
            Longitud: '-86.2504',
            Registro_GPS: new Date(),
          },
        ],
      };

      (prisma.paquete.findFirst as jest.Mock).mockResolvedValue(mockPaquete);

      const result = await service.trackPaquete(codigoGps);

      expect(result.estado_actual).toBe('En Camino');
      expect(result.ubicacion?.latitud).toBe(12.1328);
      expect(result.mensaje).toBe('Ubicación encontrada');
    });

    it('debería retornar un mensaje de "Sin señal GPS" si no hay registros GPS', async () => {
      const mockPaqueteSinGps = {
        Codigo_gps: codigoGps,
        n_Receptor: 'Laureano',
        Estados: { n_Estado: 'Almacén' },
        Seguimiento_GPS: [],
      };

      (prisma.paquete.findFirst as jest.Mock).mockResolvedValue(
        mockPaqueteSinGps,
      );

      const result = await service.trackPaquete(codigoGps);

      expect(result.ubicacion).toBeNull();
      expect(result.mensaje).toBe('Sin señal GPS');
    });

    it('debería lanzar NotFoundException si el paquete no existe', async () => {
      (prisma.paquete.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.trackPaquete('INVALIDO')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
