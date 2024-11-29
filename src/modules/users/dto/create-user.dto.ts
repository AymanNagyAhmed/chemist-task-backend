import { IsEmail, IsOptional, IsString, IsDateString, MinLength, IsArray } from 'class-validator';
import { PreferredLocationDto } from '@/modules/users/dto/preferred-location.dto';
import { ProgrammingSkillDto } from '@/modules/users/dto/programming-skill.dto';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  resumeSummary?: string;

  @IsOptional()
  preferredLocation?: PreferredLocationDto;

  @IsArray()
  @IsOptional()
  programmingSkills?: ProgrammingSkillDto[];
} 