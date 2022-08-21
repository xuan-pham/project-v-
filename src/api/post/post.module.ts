import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from '../../config/entity/post.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PostRepository } from './post.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts]),
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
