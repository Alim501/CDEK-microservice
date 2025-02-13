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
exports.CreateDeliveryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateDeliveryDto {
}
exports.CreateDeliveryDto = CreateDeliveryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ALA12 ', description: 'Код пвз' }),
    (0, class_validator_1.IsString)({ message: 'Неверный код ПВЗ' }),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "delivery_point", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'М.png', description: 'Параметры размера' }),
    (0, class_validator_1.IsString)({ message: 'путь к файлу должно быть строкой' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "img", void 0);
//# sourceMappingURL=create-delivery.dto.js.map