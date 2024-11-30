import { Module } from '@nestjs/common';
import { ProgrammingSkillsController } from '@/modules/programming-skills/programming-skills.controller';
import { ProgrammingSkillsService } from '@/modules/programming-skills/programming-skills.service';

@Module({
  controllers: [ProgrammingSkillsController],
  providers: [ProgrammingSkillsService],
})
export class ProgrammingSkillsModule {} 