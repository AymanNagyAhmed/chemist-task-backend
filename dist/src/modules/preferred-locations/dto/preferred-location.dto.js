"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferredLocationDto = void 0;
const openapi = require("@nestjs/swagger");
class PreferredLocationDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, locationName: { required: true, type: () => String } };
    }
}
exports.PreferredLocationDto = PreferredLocationDto;
//# sourceMappingURL=preferred-location.dto.js.map