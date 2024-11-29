import { IsString, IsInt } from 'class-validator';

export class ProgrammingSkillDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;
} 