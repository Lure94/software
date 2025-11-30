import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma/prisma.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { LoginModule } from './login/login.module.js';
import { ManagerModule } from './manager/manager.module.js';
import { AdminModule } from './admin/admin.module.js';
import { ConfigModule } from '@nestjs/config';
import { CourierModule } from './courier/courier.module.js';
import { UserModule } from './user/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    LoginModule,
    ManagerModule,
    AdminModule,
    CourierModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
