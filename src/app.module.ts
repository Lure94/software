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
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'global',
        ttl: 60000,
        limit: 100,
      },
    ]),
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
