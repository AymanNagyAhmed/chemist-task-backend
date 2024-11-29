import { IsNumber, IsOptional } from 'class-validator';

export class PreferredLocationDto {
  @IsNumber()
  @IsOptional()
  id?: number;
} 