import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { CourierService } from './courier.service.js';
import { AppRole, Roles } from '../decorators/roles.decorator.js';
import type { JwtPayload } from '../interface/jwtPayload.interface.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';

@ApiTags('Courier')
@ApiBearerAuth()
@Controller('courier')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CourierController {
  constructor(private readonly courierService: CourierService) {}

  @Get('paquetes')
  @Roles(AppRole.COURIER)
  @ApiOperation({ summary: 'Ver paquetes asignados y su ubicación' })
  getMyPackages(@CurrentUser() user: JwtPayload) {
    const userEmail = user.user.email;
    return this.courierService.getMyPackages(userEmail);
  }
}
