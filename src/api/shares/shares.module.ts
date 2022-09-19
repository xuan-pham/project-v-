import { Module } from '@nestjs/common';
import { SharesService } from './shares.service';
import { SharesController } from './shares.controller';
import { SharesReponsitory } from './shares.reponsitory';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shares } from 'src/config/entity/share.entity';
import { UserRepository } from '../user/user.repository';
import { PostRepository } from '../post/post.repository';
import { Users } from 'src/config/entity/user.entity';
import { Posts } from 'src/config/entity/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shares, Users, Posts])],
  providers: [SharesService, SharesReponsitory, UserRepository, PostRepository],
  controllers: [SharesController],
})
export class SharesModule {}
