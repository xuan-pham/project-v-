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
import { ProcessModule } from '../process/process.module';
import { ProcessRepository } from '../process/process.repository';
import { Process } from '../../config/entity/process.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Comments, Users, Process]),
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
    BullsModule,
    ProcessModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, ProcessRepository],
  exports: [PostService],
})
export class PostModule {}
