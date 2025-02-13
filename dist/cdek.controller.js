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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdekController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const cdek_service_1 = require("./cdek.service");
let CdekController = class CdekController {
    constructor(cdekService) {
        this.cdekService = cdekService;
    }
    async calculateDelivery(payload) {
        console.log('Запрос на расчет доставки:', payload);
        return this.cdekService.calculateDelivery(payload.items, payload.toCity, payload.currency);
    }
    async suggestPattern(payload) {
        return this.cdekService.suggestCity(payload.name);
    }
    async findPVZ(payload) {
        return this.cdekService.findPVZ(payload.city_code, payload.name);
    }
};
exports.CdekController = CdekController;
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'calculate-delivery' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CdekController.prototype, "calculateDelivery", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'suggest-city' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CdekController.prototype, "suggestPattern", null);
__decorate([
    (0, microservices_1.MessagePattern)({ cmd: 'find-PVZ' }),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CdekController.prototype, "findPVZ", null);
exports.CdekController = CdekController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [cdek_service_1.CdekService])
], CdekController);
//# sourceMappingURL=cdek.controller.js.map