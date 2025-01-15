import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CdekService } from './cdek.service';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [CdekService],
  exports: [CdekService],
})
export class CdekModule {}
