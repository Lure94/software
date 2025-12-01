import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
@ApiTags('Autenticación')
@Controller('user')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario publico' })
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.loginService.registerUser(registerAuthDto);
  }

  @Post('login')
  @UseGuards(ThrottlerGuard)
  @Throttle({ global: { limit: 10, ttl: 60000 } })
  @ApiOperation({ summary: 'Iniciar sesión de un usuario' })
  @ApiResponse({ status: 201, description: 'Login exitoso, devuelve JWT' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.loginService.loginUser(loginAuthDto);
  }
}
