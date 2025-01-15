"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CdekService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let CdekService = class CdekService {
    constructor() {
        this.clientId = process.env.CDEK_CLIENT_ID;
        this.clientSecret = process.env.CDEK_CLIENT_SECRET;
    }
    async getToken() {
        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            const response = await axios_1.default.post('https://api.edu.cdek.ru/v2/oauth/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data.access_token;
        }
        catch (error) {
            console.error('Ошибка при получении токена:', error.response?.data || error.message);
            throw new Error('Ошибка аутентификации в API СДЭК');
        }
    }
    async calculateDelivery(toCity) {
        try {
            const token = await this.getToken();
            const response = await axios_1.default.post('https://api.edu.cdek.ru/v2/calculator/tariff', {
                type: '2',
                date: '2020-11-03T11:49:32+0700',
                currency: '1',
                tariff_code: '139',
                from_location: {
                    code: 270,
                },
                to_location: {
                    code: 44,
                },
                services: [
                    {
                        code: 'CARTON_BOX_XS',
                        parameter: '2',
                    },
                ],
                packages: [
                    {
                        height: 10,
                        length: 10,
                        weight: 4000,
                        width: 10,
                    },
                ],
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Успешный расчет доставки:', response.data);
            return response.data;
        }
        catch (error) {
            console.error('Ошибка при расчете доставки:', error.response?.data || error.message);
            throw new Error('Ошибка при расчете доставки. Проверьте данные.');
        }
    }
};
exports.CdekService = CdekService;
exports.CdekService = CdekService = __decorate([
    (0, common_1.Injectable)()
], CdekService);
//# sourceMappingURL=cdek.service.js.map