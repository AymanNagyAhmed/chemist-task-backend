import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ProgrammingSkillDto } from '@/modules/programming-skills/dto/programming-skill.dto';

@Injectable()
export class ProgrammingSkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ProgrammingSkillDto[]> {
    const skills = await this.prisma.programmingSkill.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    return skills;
  }
} 