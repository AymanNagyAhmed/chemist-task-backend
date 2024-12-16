"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgrammingSkillsModule = void 0;
const common_1 = require("@nestjs/common");
const programming_skills_controller_1 = require("./programming-skills.controller");
const programming_skills_service_1 = require("./programming-skills.service");
let ProgrammingSkillsModule = class ProgrammingSkillsModule {
};
exports.ProgrammingSkillsModule = ProgrammingSkillsModule;
exports.ProgrammingSkillsModule = ProgrammingSkillsModule = __decorate([
    (0, common_1.Module)({
        controllers: [programming_skills_controller_1.ProgrammingSkillsController],
        providers: [programming_skills_service_1.ProgrammingSkillsService],
    })
], ProgrammingSkillsModule);
//# sourceMappingURL=programming-skills.module.js.map