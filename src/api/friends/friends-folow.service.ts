import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { FriendsRepository } from './friends-folow.reponsitory';

@Injectable()
export class FriendsService {
  constructor(
    private friendsRepository: FriendsRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async getListFolow(id: number) {
    const data = await this.friendsRepository.getList(id);
    return data;
  }

  async addFriend(userId: number, friendsId: number) {
    const user = await this.userRepository.findById(friendsId);
    if (!user) throw new NotFoundException('friend not exist');

    if (userId === friendsId)
      throw new BadRequestException(`Don't interactive myself`);

    const checkUserId = await this.friendsRepository.checkUserId(userId);
    checkUserId.forEach((t) => {
      if (t.friends === friendsId && t.isStatus === true) {
        throw new BadRequestException('Already friend');
      }
    });

    checkUserId.forEach((t) => {
      if (t.friends === friendsId && t.isStatus === false) {
        throw new BadRequestException(
          'You already sent friend request for this friend',
        );
      }
    });
    return this.friendsRepository.add(userId, friendsId);
  }

  async acceptFriend(id: number) {
    return this.friendsRepository.update(id);
  }

  async removeFriend(id: number) {
    const check = await this.friendsRepository._findById(id);
    if (!check) throw new NotFoundException('Not exits');
    return this.friendsRepository.remove(id);
  }
}
