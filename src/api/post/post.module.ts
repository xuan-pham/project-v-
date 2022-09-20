import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../../config/entity/post.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PostRepository } from './post.repository';
import { Comments } from '../../config/entity/comment.entity';
import { Users } from '../../config/entity/user.entity';
import { BullsModule } from 'src/config/bulls/bulls.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Comments, Users]),
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
    BullsModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
  exports: [PostService],
})
export class PostModule {}
