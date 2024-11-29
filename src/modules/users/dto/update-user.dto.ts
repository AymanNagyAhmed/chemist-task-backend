import { IsEmail, IsOptional, IsString, IsDateString, MinLength, IsInt, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @IsString()
  @MinLength(5, { message: 'fullName must be at least 5 characters long' })
  fullName: string;

  @IsDateString()
  dateOfBirth: string;

  @IsString()
  @MinLength(5, { message: 'resumeSummary must be at least 5 characters long' })
  resumeSummary: string;

  @Type(() => Number)
  @IsInt({ message: 'preferredLocationId must be an integer' })
  preferredLocationId: number;

  @IsArray()
  @IsInt({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return [...new Set(value)];
    }
    return value;
  })
  programmingSkills: number[];
} 