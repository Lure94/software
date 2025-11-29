import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ManagerService } from './manager.service.js';
import { Roles, AppRole } from '../decorators/roles.decorator.js';
import { RegisterUserManagerDto } from './dto/register-user.dto.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto.js';

@ApiTags('Admin Manager')
@ApiBearerAuth()
@Controller('admin/manager')
@UseGuards(RolesGuard, JwtAuthGuard)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('register')
  @ApiOperation({ summary: 'Crea un nuevo usuario con un rol especifico' })
  @Roles(AppRole.MANAGER)
  createUserManager(@Body() RegisterUserManagerDto: RegisterUserManagerDto) {
    return this.managerService.createUserManager(RegisterUserManagerDto);
  }

  @Patch('update/:email')
  @ApiOperation({ summary: 'Actualiza un usuario existente' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  @Roles(AppRole.MANAGER)
  updateUser(@Body() updateUserDto: RegisterUserManagerDto) {
    return this.managerService.updateUser(updateUserDto.Email, updateUserDto);
  }

  @Delete('delete/:email')
  @ApiOperation({ summary: 'Elimina un usuario por su email' })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado.',
  })
  @Roles(AppRole.MANAGER)
  deleteUser(@Body('email') email: UpdateUserDto['Email']) {
    return this.managerService.removeUser(email);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Obtiene todos los roles disponibles' })
  @Roles(AppRole.MANAGER)
  getAllRoles() {
    return this.managerService.getAllRoles();
  }
}
