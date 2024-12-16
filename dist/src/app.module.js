"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const preferred_locations_module_1 = require("./modules/preferred-locations/preferred-locations.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const env_validation_1 = require("./config/env.validation");
const prisma_module_1 = require("./prisma/prisma.module");
const programming_skills_module_1 = require("./modules/programming-skills/programming-skills.module");
const media_controller_1 = require("./common/controllers/media.controller");
const media_service_1 = require("./common/services/media.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: env_validation_1.validationSchema,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            preferred_locations_module_1.PreferredLocationsModule,
            programming_skills_module_1.ProgrammingSkillsModule
        ],
        controllers: [app_controller_1.AppController, media_controller_1.MediaController],
        providers: [app_service_1.AppService, media_service_1.MediaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map