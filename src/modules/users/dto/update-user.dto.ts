import { IsEmail, IsOptional, IsString, IsDateString, MinLength, IsNumber, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  resumeSummary?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    return Number(value);
  })
  preferredLocationId?: number;

  @IsArray()
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') return undefined;
    // If it's already an array, transform each element to number
    if (Array.isArray(value)) {
      return value.map(v => Number(v));
    }
    // If it's a string, try to parse it as JSON
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(v => Number(v)) : undefined;
      } catch {
        return undefined;
      }
    }
    return undefined;
  })
  programmingSkills?: number[];

  @IsString()
  @IsOptional()
  profileImage?: string;
} 