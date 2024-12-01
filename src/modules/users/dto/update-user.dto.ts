import { IsEmail, IsOptional, IsString, IsDateString, MinLength, IsNumber, IsArray } from 'class-validator';

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
  preferredLocationId?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  programmingSkills?: number[];
} 