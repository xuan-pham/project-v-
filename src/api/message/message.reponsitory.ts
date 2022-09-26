import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/config/entity/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageReponsitory {
  constructor(
    @InjectRepository(Message)
    private reponsitory: Repository<Message>
  ) {}

  async add(roomId: string, userId: string, userName: string, body: string) {
    await this.reponsitory
      .createQueryBuilder()
      .insert()
      .into(Message)
      .values({
        idRoom: roomId,
        idUser: userId,
        name: userName,
        text: body,
      })
      .execute();
    return;
  }

  async _find(query: string) {
    const qb = await this.reponsitory
      .createQueryBuilder()
      .select('message')
      .from(Message, 'message')
      .where(query)
      .getMany();
    return qb;
  }

  async _findAll() {
    const qb = await this.reponsitory
      .createQueryBuilder()
      .select('message')
      .from(Message, 'message')
      .getMany();
    return qb;
  }
}
