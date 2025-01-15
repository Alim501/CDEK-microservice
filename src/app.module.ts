import { Module } from '@nestjs/common';
import { CdekModule } from './cdek.module';

@Module({
  imports: [CdekModule],
})
export class AppModule {}
