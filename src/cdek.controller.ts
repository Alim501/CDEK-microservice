import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CdekService } from './cdek.service';

@Controller()
export class CdekController {
  constructor(private readonly cdekService: CdekService) {}

  // @MessagePattern({ cmd: 'register-delivery' })
  // async registerDelivery(
  //   @Payload()
  //   payload: {
  //     delivery: {
  //       point: string;
  //       weight: number;
  //       currency: string;
  //       cost: number;
  //     };
  //     recipient: { name: string; phone: number };
  //     items: { name: string; quantity: number }[];
  //   },
  // ) {
  //   console.log('Получен запрос на регистрацию доставки:', payload);
  //   return this.cdekService.registerDelivery(
  //     payload.delivery,
  //     payload.recipient,
  //     payload.items,
  //   );
  // }

  @MessagePattern({ cmd: 'calculate-delivery' })
  async calculateDelivery(
    @Payload()
    payload: {
      items: {
        name: string;
        size: string;
        type: string;
        quantity: number;
        price: number;
      }[];
      toCity: number;
      currency: number;
    },
  ): Promise<{
    delivery: { weight: number; currency: string; cost: number };
    items: { name: string; cost: number; quantity: number }[];
  }> {
    console.log('Запрос на расчет доставки:', payload);
    return this.cdekService.calculateDelivery(
      payload.items,
      payload.toCity,
      payload.currency,
    );
  }

  @MessagePattern({ cmd: 'suggest-city' })
  async suggestPattern(
    @Payload() payload: { name: string },
  ): Promise<{ code: string; name: string }> {
    return this.cdekService.suggestCity(payload.name);
  }

  @MessagePattern({ cmd: 'find-PVZ' })
  async findPVZ(
    @Payload() payload: { city_code: number; name: string },
  ): Promise<{ code: string; name: string }> {
    return this.cdekService.findPVZ(payload.city_code, payload.name);
  }
}
