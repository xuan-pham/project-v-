import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendTo } from 'src/config/entity/friends.entity';
import { Users } from 'src/config/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsRepository {
  constructor(
    @InjectRepository(FriendTo)
    private repository: Repository<FriendTo>,
  ) {}

  _findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  add(userId, friendsId) {
    const queryBuilder = this.repository
      .createQueryBuilder()
      .insert()
      .into(FriendTo)
      .values({
        friends: friendsId,
        user: userId,
      })
      .execute();

    return queryBuilder;
  }

  async checkUserId(userId) {
    return this.repository.findBy({ user: userId });
  }

  async checkfriend(friendsId) {
    return this.repository.find({
      where: { friends: friendsId },
    });
  }

  async getList(id) {
    const queryBuilder = this.repository.find({
      where: { user: id },
      relations: {
        user: true,
      },
    });
    return queryBuilder;
  }

  async update(id) {
    return this.repository.update(id, { isStatus: true });
  }

  remove(id: number) {
    return this.repository
      .createQueryBuilder()
      .delete()
      .from(FriendTo)
      .where('id = :id', { id })
      .execute();
  }
}
