import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shares } from 'src/config/entity/share.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SharesReponsitory {
  constructor(
    @InjectRepository(Shares)
    private repository: Repository<Shares>,
  ) {}

  async list(postId) {
    const queryBuilder = await this.repository
      .createQueryBuilder('share')
      .leftJoinAndSelect('share.user', 'user')
      .where('share.postId=:postId', { postId });
    return queryBuilder.getMany();
  }

  async add(id, userId) {
    await this.repository
      .createQueryBuilder()
      .insert()
      .into(Shares)
      .values({
        post: id,
        user: userId,
      })
      .execute();
    return;
  }
}
