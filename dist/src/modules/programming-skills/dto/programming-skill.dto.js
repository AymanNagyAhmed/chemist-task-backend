"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgrammingSkillDto = void 0;
const openapi = require("@nestjs/swagger");
class ProgrammingSkillDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, name: { required: true, type: () => String } };
    }
}
exports.ProgrammingSkillDto = ProgrammingSkillDto;
//# sourceMappingURL=programming-skill.dto.js.map