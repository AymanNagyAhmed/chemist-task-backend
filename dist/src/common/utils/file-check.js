"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkImageExists = checkImageExists;
const path_1 = require("path");
const fs_1 = require("fs");
function checkImageExists(filename) {
    const filePath = (0, path_1.join)(process.cwd(), 'public', 'uploads', 'images', filename);
    console.log('Checking file path:', filePath);
    return (0, fs_1.existsSync)(filePath);
}
//# sourceMappingURL=file-check.js.map