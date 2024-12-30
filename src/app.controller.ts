import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CdekService } from './cdek.service';
@Controller()
export class AppController {
  constructor(private readonly cdekService: CdekService) {}

  @MessagePattern({ cmd: 'calculateDelivery' }) // Входящий запрос с меткой `cmd: calculateDelivery`
  async calculateDelivery(@Payload() data: any) {
    return this.cdekService.calculateDelivery(data);
  }
}
