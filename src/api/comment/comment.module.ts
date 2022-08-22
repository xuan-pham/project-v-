import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from '../../config/entity/comment.entity';
import { Posts } from '../../config/entity/post.entity';
import { Users } from '../../config/entity/user.entity';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { CommentController } from './comment.controller';
import { CommentRepository } from './comment.repository';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Comments, Posts]),
    UserModule,
    PostModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
})
export class CommentModule {}
