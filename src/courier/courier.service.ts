import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CourierService {
  constructor(private prisma: PrismaService) {}

  async getMyPackages(email: string) {
    const Mensajero = await this.prisma.mensajero.findFirst({
      where: { Email: email },
    });

    if (!Mensajero) {
      throw new NotFoundException('No se encontró al mensajero asociado');
    }

    const asignaciones = await this.prisma.paquete_m.findMany({
      where: { ID_Mensajero: Mensajero.ID_Mensajero },
      include: {
        Paquete: {
          include: {
            Estados: true,
            Direccion_Paquete_ID_Direccion_DestinoToDireccion: {
              select: {
                Calle_: true,
                Ciudad: true,
                State_departamento_: true,
                Codigo_Postal: true,
                Pais: true,
              },
            },
            USUARIO: {
              select: { Pnom: true, Papellido: true, Telefono: true },
            },
          },
        },
      },
    });

    return asignaciones.map((item) => {
      const p = item.Paquete;
      const dir = p.Direccion_Paquete_ID_Direccion_DestinoToDireccion;

      return {
        id_paquete: p.ID_Paquete,
        tracking: p.Codigo_gps,
        estado: p.Estados?.n_Estado ?? 'Desconocido',
        fecha_asignacion: item.Fecha_Asignacion,

        receptor: p.n_Receptor,
        telefono_contacto: p.USUARIO?.Telefono ?? 'No disponible',

        ubicacion_entrega: {
          calle: dir?.Calle_ ?? 'Sin calle',
          ciudad: dir?.Ciudad ?? 'Sin ciudad',
          departamento: dir?.State_departamento_ ?? '',
          pais: dir?.Pais ?? 'Sin país',
          direccion_completa: `${dir?.Calle_}, ${dir?.Ciudad}, ${dir?.State_departamento_}, ${dir?.Pais}`,
        },

        detalles_paquete: {
          peso: p.Peso,
        },
      };
    });
  }
}
