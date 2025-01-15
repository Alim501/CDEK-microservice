import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CdekService } from './cdek.service';

@Controller()
export class AppController {
  constructor(private readonly cdekService: CdekService) {}

  // Обработчик для команды calculateDelivery
  @MessagePattern({ cmd: 'calculateDelivery' })
  async calculateDelivery(toCity: number) {
    console.log('Получен запрос на расчет доставки:', toCity);
    return this.cdekService.calculateDelivery(toCity);
  }
}
