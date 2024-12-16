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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcryptjs = require("bcryptjs");
let AuthService = class AuthService {
    constructor(jwtService, usersService) {
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async validateUser(loginDto) {
        const includeOptions = {
            preferredLocation: { select: {
                    id: true,
                    locationName: true,
                }, },
            programmingSkills: {
                include: {
                    programmingSkill: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        };
        const user = await this.usersService.findUserByEmail(loginDto.email, includeOptions);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcryptjs.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            fullName: user.fullName,
        };
        const { password: _, ...userData } = user;
        const transformedUser = {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            dateOfBirth: userData.dateOfBirth,
            preferredLocation: userData.preferredLocation,
            resumeSummary: userData.resumeSummary,
            programmingSkills: userData.programmingSkills.map(skill => ({
                id: skill.programmingSkill.id,
                name: skill.programmingSkill.name
            })),
            profileImage: userData.profileImage,
        };
        return {
            user: transformedUser,
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map