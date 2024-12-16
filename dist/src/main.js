"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cors_config_1 = require("./config/cors.config");
const global_exception_filter_1 = require("./common/filters/global-exception.filter");
const path_1 = require("path");
const promises_1 = require("fs/promises");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix('api', {
        exclude: ['/public/*']
    });
    app.enableCors((0, cors_config_1.createCorsConfig)(configService));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    const uploadsPath = (0, path_1.join)(process.cwd(), 'public', 'uploads', 'images');
    await (0, promises_1.mkdir)(uploadsPath, { recursive: true });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'public'), {
        prefix: '/public',
        index: false
    });
    const port = configService.get('PORT', 4000);
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map