import { ProgrammingSkillsService } from '@/modules/programming-skills/programming-skills.service';
import { ProgrammingSkillDto } from '@/modules/programming-skills/dto/programming-skill.dto';
export declare class ProgrammingSkillsController {
    private readonly programmingSkillsService;
    constructor(programmingSkillsService: ProgrammingSkillsService);
    findAll(): Promise<ProgrammingSkillDto[]>;
}
