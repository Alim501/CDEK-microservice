import { CdekService } from './cdek.service';
export declare class AppController {
    private readonly cdekService;
    constructor(cdekService: CdekService);
    calculateDelivery(toCity: number): Promise<any>;
}
