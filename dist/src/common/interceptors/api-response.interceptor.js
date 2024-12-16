"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let ApiResponseInterceptor = class ApiResponseInterceptor {
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const method = request.method;
        return next.handle().pipe((0, operators_1.map)(data => {
            if (this.isApiResponse(data)) {
                return data;
            }
            let message = 'Operation successful';
            let statusCode = response.statusCode || common_1.HttpStatus.OK;
            switch (method) {
                case 'POST':
                    message = 'Resource created successfully';
                    statusCode = common_1.HttpStatus.CREATED;
                    break;
                case 'PUT':
                case 'PATCH':
                    message = 'Resource updated successfully';
                    break;
                case 'DELETE':
                    message = 'Resource deleted successfully';
                    break;
                case 'GET':
                    message = 'Resources retrieved successfully';
                    break;
            }
            return {
                success: true,
                statusCode,
                message,
                path: request.url,
                timestamp: new Date().toISOString(),
                data,
            };
        }));
    }
    isApiResponse(data) {
        return (data &&
            typeof data === 'object' &&
            'success' in data &&
            'statusCode' in data &&
            'message' in data &&
            'path' in data &&
            'timestamp' in data &&
            'data' in data);
    }
};
exports.ApiResponseInterceptor = ApiResponseInterceptor;
exports.ApiResponseInterceptor = ApiResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ApiResponseInterceptor);
//# sourceMappingURL=api-response.interceptor.js.map