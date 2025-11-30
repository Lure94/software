import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDireccionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  calle!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  ciudad!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  departamento!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  codigoPostal!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  pais!: string;
}
