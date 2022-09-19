import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/config/entity/message.entity';
import { MessageGateway } from './gateway/message.gateway';
import { MessageReponsitory } from './message.reponsitory';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessageService, MessageGateway, MessageReponsitory],
  controllers: [MessageController],
})
export class MessageModule {}
