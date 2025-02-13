import { CdekService } from './cdek.service';
export declare class CdekController {
    private readonly cdekService;
    constructor(cdekService: CdekService);
    calculateDelivery(payload: {
        items: {
            name: string;
            size: string;
            type: string;
            quantity: number;
            price: number;
        }[];
        toCity: number;
        currency: number;
    }): Promise<{
        delivery: {
            weight: number;
            currency: string;
            cost: number;
        };
        items: {
            name: string;
            cost: number;
            quantity: number;
        }[];
    }>;
    suggestPattern(payload: {
        name: string;
    }): Promise<{
        code: string;
        name: string;
    }>;
    findPVZ(payload: {
        city_code: number;
        name: string;
    }): Promise<{
        code: string;
        name: string;
    }>;
}
