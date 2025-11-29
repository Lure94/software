import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePaqueteDto } from './dto/create-paquete.dto.js';
import { Prisma } from '../generated/client.js';
import { FilterPaqueteDto } from './dto/filtro-paquete.dto.js';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async crearPaquete(createPaqueteDto: CreatePaqueteDto) {
    const { nombreEstado, Pnom, Snom, Papellido, Sapellido, ...paqueteData } =
      createPaqueteDto;

    const usuario = await this.prisma.usuario.findFirst({
      where: {
        Pnom: { equals: Pnom, mode: 'insensitive' },
        Snom: { equals: Snom, mode: 'insensitive' },
        Papellido: { equals: Papellido, mode: 'insensitive' },
        Sapellido: { equals: Sapellido, mode: 'insensitive' },
      },
    });

    const estado = await this.prisma.estados.findFirst({
      where: {
        n_Estado: { equals: nombreEstado, mode: 'insensitive' },
      },
    });

    if (!usuario) {
      throw new BadRequestException(
        `El usuario '${Pnom} ${Snom} ${Papellido} ${Sapellido}' no existe.`,
      );
    }

    if (!estado) {
      throw new BadRequestException(`El estado '${nombreEstado}' no existe.`);
    }

    try {
      const paquete = await this.prisma.paquete.create({
        data: {
          ...paqueteData,
          ID_USUARIO: usuario.ID_USUARIO,
          ID_Estado: estado.ID_Estado,
          Historial_Estado_Paquete: {
            create: {
              ID_Estado: estado.ID_Estado,
              Ubicacion: 'Recepcion',
              Fecha_evento: new Date(),
            },
          },
        },
        include: {
          Estados: true,
        },
      });
      return {
        message: 'Paquete creado exitosamente',
        id_paquete: paquete.ID_Paquete,
        estado: paquete.Estados.n_Estado,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new BadRequestException(
          'Error de referencia: Verifique que el usuario y las direcciones existan.',
        );
      }
    }
  }

  async getReportes(filters: FilterPaqueteDto) {
    const { fechaInicio, fechaFin } = filters;
    const whereClause: Prisma.PaqueteWhereInput = {};

    if (fechaInicio && fechaFin) {
      whereClause.Creado_en = {
        ...(fechaInicio && { gte: new Date(fechaInicio) }),
        ...(fechaFin && { lte: new Date(fechaFin) }),
      };
    }

    const paquetes = await this.prisma.paquete.findMany({
      where: whereClause,
      include: {
        USUARIO: { select: { Email: true, Pnom: true, Papellido: true } },
        Estados: true,
        Direccion_Paquete_ID_Direccion_DestinoToDireccion: {
          select: { Ciudad: true },
        },
        Direccion_Paquete_ID_Direccion_OrigenToDireccion: {
          select: { Ciudad: true },
        },
      },
      orderBy: { Creado_en: 'desc' },
    });

    return paquetes.map((paquete) => ({
      tracking_gps: paquete.Codigo_gps ?? 'No Asignado',
      cliente: `${paquete.USUARIO.Pnom} ${paquete.USUARIO.Papellido}`,
      email_cliente: paquete.USUARIO.Email,
      receptor: paquete.n_Receptor,
      origen:
        paquete.Direccion_Paquete_ID_Direccion_OrigenToDireccion?.Ciudad ??
        'N/A',
      destino:
        paquete.Direccion_Paquete_ID_Direccion_DestinoToDireccion?.Ciudad ??
        'N/A',
      estado: paquete.Estados?.n_Estado ?? 'Desconocido',
      peso_kg: paquete.Peso,
      creado_en: paquete.Creado_en,
    }));
  }
}
