"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgrammingSkillsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const programming_skills_service_1 = require("./programming-skills.service");
const api_response_interceptor_1 = require("../../common/interceptors/api-response.interceptor");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let ProgrammingSkillsController = class ProgrammingSkillsController {
    constructor(programmingSkillsService) {
        this.programmingSkillsService = programmingSkillsService;
    }
    async findAll() {
        return this.programmingSkillsService.findAll();
    }
};
exports.ProgrammingSkillsController = ProgrammingSkillsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [require("./dto/programming-skill.dto").ProgrammingSkillDto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProgrammingSkillsController.prototype, "findAll", null);
exports.ProgrammingSkillsController = ProgrammingSkillsController = __decorate([
    (0, common_1.Controller)('programming-skills'),
    (0, common_1.UseInterceptors)(api_response_interceptor_1.ApiResponseInterceptor),
    __metadata("design:paramtypes", [programming_skills_service_1.ProgrammingSkillsService])
], ProgrammingSkillsController);
//# sourceMappingURL=programming-skills.controller.js.map