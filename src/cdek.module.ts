import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CdekService } from './cdek.service';
import { CdekController } from './cdek.controller';

@Module({
  controllers: [CdekController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [CdekService],
})
export class CdekModule {}
