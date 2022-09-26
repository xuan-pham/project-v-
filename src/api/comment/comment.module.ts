import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from '../../config/entity/comment.entity';
import { Posts } from '../../config/entity/post.entity';
import { Users } from '../../config/entity/user.entity';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
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
  providers: [
    CommentService,
    CommentRepository,
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
  ],
})
export class CommentModule {}
