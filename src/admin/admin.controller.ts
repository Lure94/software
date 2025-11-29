import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { AdminService } from './admin.service.js';
import { AppRole, Roles } from '../decorators/roles.decorator.js';
import { CreatePaqueteDto } from './dto/create-paquete.dto.js';
import { FilterPaqueteDto } from './dto/filtro-paquete.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('paquetes/crear')
  @ApiOperation({ summary: 'Crea un nuevo paquete' })
  @ApiResponse({ status: 201, description: 'Paquete creado exitosamente.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear el paquete.',
  })
  @Roles(AppRole.ADMIN, AppRole.MANAGER)
  createPaquete(@Body() createPaqueteDto: CreatePaqueteDto) {
    return this.adminService.crearPaquete(createPaqueteDto);
  }

  @Get('paquetes/reporte')
  @ApiOperation({ summary: 'Obtiene reportes de paquetes' })
  @ApiResponse({ status: 200, description: 'Reporte de paquetes obtenido.' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para obtener el reporte.',
  })
  @Roles(AppRole.ADMIN, AppRole.MANAGER)
  getPaqueteReporte(@Query() filterPaqueteDto: FilterPaqueteDto) {
    return this.adminService.getReportes(filterPaqueteDto);
  }
}
