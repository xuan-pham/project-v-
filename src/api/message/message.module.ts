import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/config/entity/message.entity';
import { MessageGateway } from './gateway/message.gateway';
import { MessageReponsitory } from './message.reponsitory';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [
    MessageService,
    MessageGateway,
    MessageReponsitory,
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
  ],
  controllers: [MessageController],
})
export class MessageModule {}
