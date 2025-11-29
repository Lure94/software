import { SetMetadata } from '@nestjs/common';

export enum AppRole {
  ADMIN = 'admin',
  USER = 'user',
  COURIER = 'mensajero',
  MANAGER = 'gerente',
}
export const ROLES_KEY = 'roles';
export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
