import { PartialType } from '@nestjs/mapped-types';
import { RegisterUserManagerDto } from './register-user.dto.js';

export class UpdateUserDto extends PartialType(RegisterUserManagerDto) {}
