"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCorsConfig = void 0;
const createCorsConfig = (configService) => ({
    origin: (origin, callback) => {
        const allowedOrigins = configService.get('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001').split(',');
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: configService.get('CORS_METHODS', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS').split(','),
    credentials: configService.get('CORS_CREDENTIALS', true),
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
        'Accept',
        'Authorization',
        'Content-Type',
        'X-Requested-With',
        'Range',
        'Origin',
        'Content-Disposition',
    ],
    exposedHeaders: [
        'Content-Range',
        'X-Content-Range',
        'Content-Disposition',
    ],
    maxAge: 3600,
});
exports.createCorsConfig = createCorsConfig;
//# sourceMappingURL=cors.config.js.map