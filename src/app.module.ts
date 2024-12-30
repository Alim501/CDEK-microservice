import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CdekService } from './cdek.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CdekService],
})
export class AppModule {}
