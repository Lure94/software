import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterUserManagerDto } from './dto/register-user.dto.js';
import { hash, argon2id } from 'argon2';
import { Prisma } from '../generated/client.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { handleDBErrors } from '../utils/handleDBErrors.js';

@Injectable()
export class ManagerService {
  constructor(private prisma: PrismaService) {}

  async createUserManager(createUserDto: RegisterUserManagerDto) {
    const { Pnom, Snom, Papellido, Sapellido, Email, Password, Telefono, Rol } =
      createUserDto;

    const hashedPassword = await hash(Password, {
      type: argon2id,
    });

    try {
      const user = await this.prisma.usuario.create({
        data: {
          Pnom,
          Snom,
          Papellido,
          Sapellido,
          Email,
          Password: hashedPassword,
          Telefono,
          Rol: { connect: { nomb_rol: Rol } },
        },
        include: { Rol: true },
      });
      const { Password: _, ID_Rol: __, Rol: ___, ...result } = user;
      return { result, rol: Rol };
    } catch (error: any) {
      handleDBErrors(error);
    }
  }

  async updateUser(email: string, updateUserDto: UpdateUserDto) {
    const { Pnom, Snom, Papellido, Sapellido, Telefono, Rol } = updateUserDto;

    const dataToUpdate: Prisma.UsuarioUpdateInput = {
      ...(Pnom && { Pnom }),
      ...(Snom && { Snom }),
      ...(Papellido && { Papellido }),
      ...(Sapellido && { Sapellido }),
      ...(Telefono && { Telefono }),
    };

    if (Rol) {
      dataToUpdate.Rol = { connect: { nomb_rol: Rol } };
    }

    try {
      const user = await this.prisma.usuario.update({
        where: { Email: email },
        data: dataToUpdate,
      });
      const { Password: _, ...result } = user;
      return result;
    } catch (error: any) {
      handleDBErrors(error);
    }
  }

  async removeUser(email: UpdateUserDto['Email']) {
    try {
      const user = await this.prisma.usuario.delete({
        where: { Email: email },
      });
      const { Password: _, ...result } = user;
      return result;
    } catch (error) {
      handleDBErrors(error);
    }
  }

  async getAllRoles() {
    return this.prisma.rol.findMany({ select: { nomb_rol: true } });
  }
}
