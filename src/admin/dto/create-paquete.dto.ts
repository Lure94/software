import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { EstadosPaquete } from './estados-paquete.type.js';

export class CreatePaqueteDto {
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

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  ID_Direccion_Origen!: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  ID_Direccion_Destino!: number;

  @IsNotEmpty()
  @IsString()
  n_Receptor!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.1)
  @Type(() => Number)
  Peso!: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  Largo?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  Ancho?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  Alto?: number;

  @IsNotEmpty()
  @IsString()
  nombreEstado!: EstadosPaquete;
}
