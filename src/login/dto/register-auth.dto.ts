import { IsNotEmpty, IsEmail, MinLength, IsString } from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  Pnom!: string;

  @IsNotEmpty()
  @IsString()
  Snom!: string;

  @IsNotEmpty()
  @IsString()
  Papellido!: string;

  @IsNotEmpty()
  @IsString()
  Sapellido!: string;

  @IsEmail()
  Email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  contrase_a!: string;

  @IsNotEmpty()
  @IsString()
  Telefono_!: string;
}
