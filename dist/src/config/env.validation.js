"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = require("joi");
exports.validationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    CORS_ORIGINS: Joi.string()
        .default('http://localhost:3000,http://localhost:3001')
        .description('Comma-separated list of allowed origins'),
    CORS_METHODS: Joi.string()
        .default('GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
        .description('Comma-separated list of allowed HTTP methods'),
    CORS_CREDENTIALS: Joi.boolean()
        .default(true)
        .description('Allow credentials'),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().required(),
});
//# sourceMappingURL=env.validation.js.map