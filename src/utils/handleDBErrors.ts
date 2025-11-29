import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/client.js';

export function handleDBErrors(error: any, roleName?: string): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      throw new ConflictException('El email ya existe');
    }
    if (error.code === 'P2025') {
      // Si el mensaje incluye 'Rol' o si estábamos intentando conectar un rol...
      if (roleName && error.message.includes('Rol')) {
        throw new BadRequestException(`El rol '${roleName}' no existe.`);
      }
      throw new NotFoundException(`Usuario no encontrado.`);
    }
  }
  throw error;
}
