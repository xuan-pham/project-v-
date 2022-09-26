import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MessageService } from './message.service';
@ApiBearerAuth()
@ApiTags('message')
@Controller('message')
export class MessageController {
  constructor(private messagesService: MessageService) {}

  @Get('search?')
  async show(@Query() query: string) {
    const messages = await this.messagesService.findOne(query);
    return {
      statusCode: HttpStatus.OK,
      messages: 'successful',
      data: messages,
    };
  }

  @Get()
  async getForRoom() {
    const messages = await this.messagesService.findAll();
    return messages;
  }
}
