import { IsEmail, IsOptional, IsString, IsDateString, MinLength, IsArray, ValidateNested } from 'class-validator';
import { PreferredLocationDto } from '@/modules/users/dto/preferred-location.dto';
import { ProgrammingSkillDto } from '@/modules/users/dto/programming-skill.dto';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
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
  @ValidateNested()
  @Type(() => PreferredLocationDto)
  preferredLocation?: PreferredLocationDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProgrammingSkillDto)
  programmingSkills?: ProgrammingSkillDto[];

  @IsString()
  @IsOptional()
  profileImage?: string;
} 