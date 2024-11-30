import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ProgrammingSkillsService } from '@/modules/programming-skills/programming-skills.service';
import { ProgrammingSkillDto } from '@/modules/programming-skills/dto/programming-skill.dto';
import { ApiResponseInterceptor } from '@/common/interceptors/api-response.interceptor';
import { Public } from '@/modules/auth/decorators/public.decorator';

@Controller('api/programming-skills')
@UseInterceptors(ApiResponseInterceptor)
export class ProgrammingSkillsController {
  constructor(private readonly programmingSkillsService: ProgrammingSkillsService) {}

  @Public()
  @Get()
  async findAll(): Promise<ProgrammingSkillDto[]> {
    return this.programmingSkillsService.findAll();
  }
} 