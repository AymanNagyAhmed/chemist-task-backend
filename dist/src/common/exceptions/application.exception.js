"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationException = void 0;
const common_1 = require("@nestjs/common");
class ApplicationException extends common_1.HttpException {
    constructor(message, status = common_1.HttpStatus.BAD_REQUEST) {
        super({
            message,
            status,
        }, status);
    }
}
exports.ApplicationException = ApplicationException;
//# sourceMappingURL=application.exception.js.map