import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDireccionDto } from './dto/create-direcicon.dto.js';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async addAddress(email: string, dto: CreateDireccionDto) {
    return this.prisma.direccion.create({
      data: {
        USUARIO: {
          connect: { Email: email },
        },
        Calle_: dto.calle,
        Ciudad: dto.ciudad,
        State_departamento_: dto.departamento,
        Codigo_Postal: dto.codigoPostal,
        Pais: dto.pais,
        Creado_en: new Date(),
      },
    });
  }

  async getMyAddress(email: string) {
    return this.prisma.direccion.findMany({
      where: {
        USUARIO: {
          Email: email,
        },
      },
    });
  }

  async trackPaquete(codigoGps: string) {
    const paquete = await this.prisma.paquete.findFirst({
      where: { Codigo_gps: codigoGps },
      include: {
        Estados: true,
        Seguimiento_GPS: {
          orderBy: { Registro_GPS: 'desc' },
          take: 1,
        },
      },
    });

    if (!paquete) {
      throw new NotFoundException(
        'No se encontró ningún paquete con el código especícado.',
      );
    }

    const ultimaUbicacion = paquete.Seguimiento_GPS[0];

    return {
      tracking_id: paquete.Codigo_gps,
      estado_actual: paquete.Estados?.n_Estado ?? 'Desconocido',
      descripcion: `Paquete hacia ${paquete.n_Receptor}`,
      ubicacion: ultimaUbicacion
        ? {
            latitud: Number(ultimaUbicacion.Latitud),
            longitud: Number(ultimaUbicacion.Longitud),
            fecha_registro: ultimaUbicacion.Registro_GPS,
          }
        : null,
      mensaje: ultimaUbicacion ? 'Ubicación encontrada' : 'Sin señal GPS',
    };
  }
}
