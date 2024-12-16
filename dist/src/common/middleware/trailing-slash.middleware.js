"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrailingSlashMiddleware = void 0;
const common_1 = require("@nestjs/common");
let TrailingSlashMiddleware = class TrailingSlashMiddleware {
    use(req, res, next) {
        if (req.url.length > 1 && req.url.endsWith('/')) {
            const query = req.url.slice(req.url.indexOf('?'));
            const urlWithoutSlash = req.url.slice(0, -1) + query;
            return res.redirect(301, urlWithoutSlash);
        }
        next();
    }
};
exports.TrailingSlashMiddleware = TrailingSlashMiddleware;
exports.TrailingSlashMiddleware = TrailingSlashMiddleware = __decorate([
    (0, common_1.Injectable)()
], TrailingSlashMiddleware);
//# sourceMappingURL=trailing-slash.middleware.js.map