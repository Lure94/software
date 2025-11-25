import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegisterAuthDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  Pnom!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  Snom!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  Papellido!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  Sapellido!: string;

  @IsEmail()
  @MaxLength(60)
  Email!: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  Password!: string;

  @IsNotEmpty()
  @IsString()
  Telefono!: string;
}
