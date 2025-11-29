import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, argon2id, verify } from 'argon2';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterAuthDto } from '../login/dto/register-auth.dto.js';
import { LoginAuthDto } from '../login/dto/login-auth.dto.js';
import { handleDBErrors } from '../utils/handleDBErrors.js';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(registerAuthDto: RegisterAuthDto) {
    const { Pnom, Snom, Papellido, Sapellido, Email, Password, Telefono } =
      registerAuthDto;

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
          Rol: { connect: { ID_Rol: 1 } },
        },
        include: { Rol: true },
      });
      const { Password: _, ID_Rol: __, Rol: ___, ...result } = user;
      return { result, rol: user.Rol.nomb_rol };
    } catch (error: any) {
      handleDBErrors(error);
    }
  }

  async loginUser(loginAuthDto: LoginAuthDto) {
    const { Email, Password } = loginAuthDto;

    const user = await this.prisma.usuario.findUnique({
      where: { Email },
      include: { Rol: true },
    });

    if (!user) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isPasswordValid = await verify(user.Password, Password);

    if (!isPasswordValid) {
      throw new HttpException(
        'Credenciales inválidas',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload = { Email: user.Email, sub: user.ID_USUARIO };
    return {
      user: { nombre: user.Pnom, email: user.Email, rol: user.Rol.nomb_rol },
      token: this.jwtService.sign(payload),
    };
  }
}
