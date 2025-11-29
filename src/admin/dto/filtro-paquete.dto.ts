import { IsOptional, IsDateString } from 'class-validator';

export class FilterPaqueteDto {
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;
}
