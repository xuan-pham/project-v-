import { Module } from '@nestjs/common';
import { CommetController } from './commet.controller';
import { CommetService } from './commet.service';

@Module({
  controllers: [CommetController],
  providers: [CommetService]
})
export class CommetModule {}
