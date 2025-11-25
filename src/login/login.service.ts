import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, argon2id, verify } from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterAuthDto } from '../login/dto/register-auth.dto.js';
import { LoginAuthDto } from '../login/dto/login-auth.dto.js';
import { Prisma } from '../generated/prisma/client.js';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerAuthDto: RegisterAuthDto) {
    const { Pnom, Snom, Papellido, Sapellido, Email, contrase_a, Telefono_ } =
      registerAuthDto;

    const hashedPassword = await hash(contrase_a, {
      type: argon2id,
    });

    try {
      const user = await this.prisma.uSUARIO.create({
        data: {
          Pnom,
          Snom,
          Papellido,
          Sapellido,
          Email,
          contrase_a: hashedPassword,
          Telefono_,
          Rol: { connect: { ID_Rol: 1 } },
        },
      });
      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException(
          'El correo ya está registrado',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Error al registrar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async loginUser(loginAuthDto: LoginAuthDto) {
    const { Email, contrase_a } = loginAuthDto;

    const user = await this.prisma.uSUARIO.findUnique({
      where: { Email },
    });

    if (!user) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await verify(user.contrase_a, contrase_a);

    if (!isPasswordValid) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { Email: user.Email, sub: user.ID_USUARIO };
    return {
      user: { nombre: user.Pnom, email: user.Email, rol: user.ID_Rol },
      token: this.jwtService.sign(payload),
    };
  }
}
