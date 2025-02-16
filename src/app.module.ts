import { Module } from '@nestjs/common';
import { CdekModule } from './cdek.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    CdekModule,
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
  ],
})
export class AppModule {}
