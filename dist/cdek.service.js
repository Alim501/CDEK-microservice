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
        this.almatyPVZ = {
            code: 'ALM12',
            uuid: '8493c3ec-810a-4961-8e21-8d297f6410ae',
            location: {
                country_code: 'KZ',
                region_code: 1877,
                city_code: 4756,
                city_uuid: '3e1c12fe-52a5-41d6-ad84-5109035138a0',
            },
        };
        this.package = [
            {
                title: 'футболки',
                length: 30,
                width: 25,
                height: 3,
                weight: 250,
            },
            {
                title: 'худи',
                length: 35,
                width: 30,
                height: 8,
                weight: 400,
            },
            {
                title: 'лонги',
                length: 30,
                width: 25,
                height: 3,
                weight: 750,
            },
        ];
    }
    async getToken() {
        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'client_credentials');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            const response = await axios_1.default.post('https://api.cdek.ru/v2/oauth/token', params);
            return response.data.access_token;
        }
        catch (error) {
            console.error('Ошибка при получении токена:', error.response?.data || error.message);
            throw new Error('Ошибка аутентификации в API СДЭК');
        }
    }
    async calculateDelivery(items, toCity, currency) {
        try {
            const token = await this.getToken();
            const matchedPackages = items.map((item) => {
                const pack = this.package.find((p) => p.title.toLowerCase() === item.type.toLowerCase());
                return pack;
            });
            const totalWeight = matchedPackages.reduce((sum, p) => sum + p.weight, 0);
            const maxLength = Math.max(...matchedPackages.map((p) => p.length), 0);
            const maxWidth = Math.max(...matchedPackages.map((p) => p.width), 0);
            const totalHeight = matchedPackages.reduce((sum, p) => sum + p.height, 0);
            const serviceCode = currency === 7
                ? totalWeight >= 1500
                    ? 'CARTON_BOX_L'
                    : totalWeight >= 750
                        ? 'CARTON_BOX_M'
                        : 'CARTON_BOX_XS'
                : null;
            const requestData = {
                type: '1',
                tariff_code: '136',
                from_location: { code: this.almatyPVZ.location.city_code },
                to_location: { code: toCity },
                currency: 0,
                packages: [
                    {
                        weight: totalWeight,
                        length: maxLength,
                        width: maxWidth,
                        height: totalHeight,
                    },
                ],
                ...(serviceCode
                    ? { services: [{ code: serviceCode, parameter: '1' }] }
                    : {}),
            };
            const response = await axios_1.default.post('https://api.cdek.ru/v2/calculator/tariff', requestData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            let deliveryCurrency = 'KZT';
            let cost = Math.round(response.data.total_sum);
            if (currency === 1) {
                cost = Math.round(cost / 4.5 + 0.07 * (cost / 4.5));
                deliveryCurrency = 'RUB';
            }
            else if (currency === 7) {
                cost = Math.round(cost / 149 + 0.07 * (cost / 149));
                deliveryCurrency = 'BYN';
            }
            const formattedItems = items.map((item) => ({
                name: `${item.name} ${item.size}`,
                cost: item.price,
                quantity: item.quantity,
            }));
            return {
                delivery: {
                    weight: response.data.weight_calc,
                    currency: deliveryCurrency,
                    cost,
                },
                items: formattedItems,
            };
        }
        catch (error) {
            console.error('Ошибка при расчете доставки:', error.response?.data || error.message);
            throw new Error('Ошибка при расчете доставки. Проверьте данные.');
        }
    }
    async suggestCity(name) {
        try {
            const token = await this.getToken();
            const response = await axios_1.default.get('https://api.cdek.ru/v2/location/suggest/cities', {
                params: { name },
                headers: { Authorization: `Bearer ${token}` },
            });
            return { code: response.data.code, name: response.data.full_name };
        }
        catch (error) {
            console.error('Ошибка при подборе города:', error.response?.data || error.message);
            throw new Error('Ошибка при подборе города. Проверьте данные.');
        }
    }
    async findPVZ(city_code, name) {
        try {
            const token = await this.getToken();
            const response = await axios_1.default.get('https://api.cdek.ru/v2/deliverypoints', {
                params: { city_code, type: 'PVZ', size: 10 },
                headers: { Authorization: `Bearer ${token}` },
            });
            const pvzList = response.data;
            const filteredPVZ = name
                ? pvzList.filter((pvz) => new RegExp(name, 'i').test(pvz.name))
                : pvzList;
            console.log(' Найденные ПВЗ:', filteredPVZ);
            return { code: filteredPVZ.code, name: filteredPVZ.name };
        }
        catch (error) {
            console.error(' Ошибка при поиске ПВЗ:', error.response?.data || error.message);
            throw new Error('Ошибка при поиске ПВЗ. Проверьте данные.');
        }
    }
};
exports.CdekService = CdekService;
exports.CdekService = CdekService = __decorate([
    (0, common_1.Injectable)()
], CdekService);
//# sourceMappingURL=cdek.service.js.map