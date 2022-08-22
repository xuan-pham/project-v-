import { Module } from '@nestjs/common';
import { MessageGateway } from './gateway/message.gateway';
import { MessageService } from './message.service';

@Module({
  providers: [MessageService, MessageGateway],
})
export class MessageModule {}
