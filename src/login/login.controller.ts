import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { RegisterAuthDto } from './dto/register-auth.dto.js';
import { LoginAuthDto } from './dto/login-auth.dto.js';
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.loginService.registerUser(registerAuthDto);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.loginService.loginUser(loginAuthDto);
  }
}
