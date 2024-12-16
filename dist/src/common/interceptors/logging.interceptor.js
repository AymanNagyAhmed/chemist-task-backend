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
var LoggingInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const config_1 = require("@nestjs/config");
let LoggingInterceptor = LoggingInterceptor_1 = class LoggingInterceptor {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(LoggingInterceptor_1.name);
    }
    intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const requestId = this.generateRequestId();
        const startTime = Date.now();
        this.logRequest(request, requestId);
        return next.handle().pipe((0, operators_1.tap)({
            next: (data) => {
                this.logResponse(request, response, data, startTime, requestId);
            },
            error: (error) => {
                this.logErrorResponse(request, error, startTime, requestId);
            },
        }));
    }
    logRequest(request, requestId) {
        const { method, url, body, headers } = request;
        this.logger.log({
            type: 'Request',
            requestId,
            timestamp: new Date().toISOString(),
            method,
            url,
            headers: this.sanitizeHeaders(headers),
            body: this.sanitizeBody(body),
        });
    }
    logResponse(request, response, data, startTime, requestId) {
        const responseTime = Date.now() - startTime;
        this.logger.log({
            type: 'Response',
            requestId,
            timestamp: new Date().toISOString(),
            method: request.method,
            url: request.url,
            statusCode: response.statusCode,
            responseTime: `${responseTime}ms`,
            ...(this.isDevelopment() && { data: this.sanitizeData(data) }),
        });
    }
    logErrorResponse(request, error, startTime, requestId) {
        const responseTime = Date.now() - startTime;
        this.logger.error({
            type: 'Error Response',
            requestId,
            timestamp: new Date().toISOString(),
            method: request.method,
            url: request.url,
            statusCode: error.status || 500,
            responseTime: `${responseTime}ms`,
            error: {
                name: error.name,
                message: error.message,
                stack: this.isDevelopment() ? error.stack : undefined,
            },
        });
    }
    sanitizeHeaders(headers) {
        const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
        const sanitizedHeaders = { ...headers };
        sensitiveHeaders.forEach((header) => {
            if (sanitizedHeaders[header]) {
                sanitizedHeaders[header] = '[REDACTED]';
            }
        });
        return sanitizedHeaders;
    }
    sanitizeBody(body) {
        if (!body)
            return body;
        const sensitiveFields = ['password', 'token', 'secret', 'creditCard'];
        const sanitizedBody = { ...body };
        Object.keys(sanitizedBody).forEach((key) => {
            if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                sanitizedBody[key] = '[REDACTED]';
            }
        });
        return sanitizedBody;
    }
    sanitizeData(data) {
        if (!data)
            return data;
        const maxLength = 1000;
        const stringified = JSON.stringify(data);
        if (stringified.length > maxLength) {
            return {
                message: 'Response data truncated due to size',
                preview: stringified.substring(0, maxLength) + '...',
            };
        }
        return data;
    }
    generateRequestId() {
        return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    }
    isDevelopment() {
        return this.configService.get('NODE_ENV') === 'development';
    }
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = LoggingInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map