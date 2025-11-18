import { Module } from '@nestjs/common';
import { LoginService } from './login.service.js';
import { LoginController } from './login.controller.js';

@Module({
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
