interface ProgrammingSkillData {
  id: number;
  name: string;
}

interface PreferredLocation {
    id: number;
    locationName: string;
  }

export interface AuthUserData {
  id: number;
  email: string;
  fullName: string | null;
  dateOfBirth: Date | null;
  preferredLocation: PreferredLocation | null;
  resumeSummary: string | null;
  profileImage: string | null;
  programmingSkills: ProgrammingSkillData[];
}

export interface AuthResponse {
  user: AuthUserData;
  access_token: string;
} 