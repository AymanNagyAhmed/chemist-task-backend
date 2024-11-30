import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  // CORS
  CORS_ORIGINS: Joi.string()
    .default('http://localhost:4000,http://localhost:8000')
    .description('Comma-separated list of allowed origins'),
  CORS_METHODS: Joi.string()
    .default('GET,HEAD,PUT,PATCH,POST,DELETE')
    .description('Comma-separated list of allowed HTTP methods'),
  CORS_CREDENTIALS: Joi.boolean()
    .default(true)
    .description('Allow credentials'),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
}); 