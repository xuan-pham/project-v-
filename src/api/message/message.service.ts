import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageReponsitory } from './message.reponsitory';

@Injectable()
export class MessageService {
  constructor(private messageReponsitory: MessageReponsitory) {}

  isEmptyObject = (v) => {
    return Object.keys(v).length === 0;
  };
  messages: CreateMessageDto[] = [{ name: '', text: '' }];
  clientToUser = {};
  identify(name: string, clientId: string, roomId: number) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text,
    };
    this.messages.push(message);
    const userId = clientId;
    const userName = this.clientToUser[clientId];
    const body = message.text;
    const roomId = '1';
    this.messageReponsitory.add(roomId, userId, userName, body);
    return message;
  }

  findAll() {
    return this.messageReponsitory._findAll();
    // const message = await this.messageReponsitory._findAll();
  }

  async findOne(query) {
    if (query.idUser || query.idRoom || query.name) {
      const message = await this.messageReponsitory._find(query);
      if (message.length === 0)
        throw new NotFoundException('message not found');
      return message;
    }
    throw new BadRequestException();
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
  getClientName(clientId: string) {
    return this.clientToUser[clientId];
  }
}
