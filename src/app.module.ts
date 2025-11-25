import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { LoginModule } from './login/login.module.js';

@Module({
  imports: [PrismaModule, LoginModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
