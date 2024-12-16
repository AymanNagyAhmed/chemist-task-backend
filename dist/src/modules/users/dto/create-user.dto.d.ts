import { PreferredLocationDto } from '@/modules/users/dto/preferred-location.dto';
import { ProgrammingSkillDto } from '@/modules/users/dto/programming-skill.dto';
export declare class CreateUserDto {
    email: string;
    password: string;
    fullName?: string;
    dateOfBirth?: string;
    resumeSummary?: string;
    preferredLocation?: PreferredLocationDto;
    programmingSkills?: ProgrammingSkillDto[];
    profileImage?: string;
}
