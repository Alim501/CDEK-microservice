import { Module } from '@nestjs/common';
import { CdekService } from './cdek.service';
import { CdekController } from './cdek.controller';

@Module({
  controllers: [CdekController],
  providers: [CdekService],
})
export class CdekModule {}
