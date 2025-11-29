import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsString,
  MaxLength,
  Length,
} from 'class-validator';

export class RegisterUserManagerDto {
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
  @Length(8, 8, { message: 'El teléfono debe tener exactamente 8 caracteres' })
  Telefono!: string;

  @IsNotEmpty()
  @IsString()
  Rol!: string;
}
