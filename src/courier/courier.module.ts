import { Module } from '@nestjs/common';
import { CourierController } from './courier.controller.js';
import { CourierService } from './courier.service.js';

@Module({
  controllers: [CourierController],
  providers: [CourierService],
})
export class CourierModule {}
