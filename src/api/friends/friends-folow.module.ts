import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendTo } from 'src/config/entity/friends.entity';
import { Users } from 'src/config/entity/user.entity';
import { UserRepository } from '../user/user.repository';
import { FriendsController } from './friends-folow.controller';
import { FriendsRepository } from './friends-folow.reponsitory';
import { FriendsService } from './friends-folow.service';

@Module({
  imports: [TypeOrmModule.forFeature([FriendTo, Users])],
  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepository, UserRepository],
})
export class FriendsModule {}
