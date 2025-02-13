export declare class CdekService {
    private readonly clientId;
    private readonly clientSecret;
    private readonly almatyPVZ;
    private readonly package;
    private getToken;
    calculateDelivery(items: {
        name: string;
        size: string;
        type: string;
        quantity: number;
        price: number;
    }[], toCity: number, currency: number): Promise<{
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
    suggestCity(name: string): Promise<{
        code: string;
        name: string;
    }>;
    findPVZ(city_code: number, name: string): Promise<{
        code: string;
        name: string;
    }>;
}
