import { PrismaService } from '@/prisma/prisma.service';
import { ProgrammingSkillDto } from '@/modules/programming-skills/dto/programming-skill.dto';
export declare class ProgrammingSkillsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<ProgrammingSkillDto[]>;
}
