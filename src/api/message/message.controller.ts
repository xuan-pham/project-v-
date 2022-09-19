import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';

@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private messagesService: MessageService) {}

  @Get('search')
  show(@Query() query) {
    return this.messagesService.findOne(query);
  }
}
