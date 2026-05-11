import { Test, TestingModule } from '@nestjs/testing';
import { CourierService } from './courier.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { NotFoundException } from '@nestjs/common';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';

describe('CourierService', () => {
  let service: CourierService;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CourierService,
        {
          provide: PrismaService,
          useValue: {
            mensajero: { findFirst: jest.fn() },
            paquete_m: { findMany: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<CourierService>(CourierService);
    prisma = module.get(PrismaService);
  });

  describe('getMyPackages', () => {
    const email = 'mensajero@nikaflex.com';

    it('debería retornar los paquetes mapeados si el mensajero existe', async () => {
      (prisma.mensajero.findFirst as jest.Mock).mockResolvedValue({
        ID_Mensajero: 'uuid-mensajero-123',
        Email: email,
      });

      const mockAsignaciones = [
        {
          Fecha_Asignacion: new Date(),
          Paquete: {
            ID_Paquete: 1,
            Codigo_gps: 'GPS-001',
            n_Receptor: 'Juan Perez',
            Peso: 10.5,
            Estados: { n_Estado: 'En Reparto' },
            USUARIO: { Telefono: '88887777' },
            Direccion_Paquete_ID_Direccion_DestinoToDireccion: {
              Calle_: 'Calle Central',
              Ciudad: 'Leon',
              State_departamento_: 'Leon',
              Pais: 'Nicaragua',
              Codigo_Postal: '21000',
            },
          },
        },
      ];

      (prisma.paquete_m.findMany as jest.Mock).mockResolvedValue(mockAsignaciones);

      const result = await service.getMyPackages(email);

      // Verificaciones
      expect(result).toHaveLength(1);
      expect(result[0].tracking).toBe('GPS-001');
      expect(result[0].estado).toBe('En Reparto');
      expect(result[0].ubicacion_entrega.ciudad).toBe('Leon');
      expect(result[0].telefono_contacto).toBe('88887777');
    });

    it('debería lanzar NotFoundException si el mensajero no existe', async () => {
      (prisma.mensajero.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.getMyPackages(email)).rejects.toThrow(
        new NotFoundException('No se encontró al mensajero asociado'),
      );
    });

    it('debería retornar un array vacío si el mensajero no tiene paquetes', async () => {
      (prisma.mensajero.findFirst as jest.Mock).mockResolvedValue({
        ID_Mensajero: 'uuid-123',
      });
      (prisma.paquete_m.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getMyPackages(email);
      expect(result).toEqual([]);
    });
  });
});
