"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const application_exception_1 = require("./common/exceptions/application.exception");
let AppService = class AppService {
    async getHello() {
        const someCondition = false;
        if (someCondition) {
            throw new application_exception_1.ApplicationException('Custom error message', common_1.HttpStatus.BAD_REQUEST);
        }
        return {
            success: true,
            statusCode: common_1.HttpStatus.OK,
            message: 'Greeting retrieved successfully',
            path: '/',
            timestamp: new Date().toISOString(),
            data: { message: 'Hello World!' }
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map