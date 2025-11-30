import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { UserService } from './user.service.js';
import { AppRole, Roles } from '../decorators/roles.decorator.js';
import type { JwtPayload } from '../interface/jwtPayload.interface.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { CreateDireccionDto } from './dto/create-direcicon.dto.js';

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('direccion')
  @Roles(AppRole.USER, AppRole.ADMIN, AppRole.MANAGER, AppRole.COURIER)
  @ApiOperation({ summary: 'Agregar direccion de un usuario' })
  addAddress(
    @CurrentUser() user: JwtPayload,
    @Body() createDireccionDto: CreateDireccionDto,
  ) {
    return this.userService.addAddress(user.user.email, createDireccionDto);
  }

  @Get('misDirecciones')
  @Roles(AppRole.USER, AppRole.ADMIN, AppRole.MANAGER, AppRole.COURIER)
  @ApiOperation({ summary: 'Obtener las direcciones del usuario actual' })
  getMyAddress(@CurrentUser() user: JwtPayload) {
    return this.userService.getMyAddress(user.user.email);
  }

  @Get('tracking/:codigo')
  @Roles(AppRole.USER, AppRole.ADMIN, AppRole.MANAGER, AppRole.COURIER)
  @ApiOperation({ summary: 'Rastrear un paquete por su código GPS' })
  trackPaquete(@Param('codigo') codigo: string) {
    return this.userService.trackPaquete(codigo);
  }
}
