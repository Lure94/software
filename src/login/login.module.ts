import { Global, Module } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginController } from './login.controller.js';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../utils/jwt.strategy.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PassportModule } from '@nestjs/passport';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY!,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [LoginService, JwtStrategy, PrismaService],
  controllers: [LoginController],
  exports: [JwtModule, PassportModule, LoginService],
})
export class LoginModule {}
