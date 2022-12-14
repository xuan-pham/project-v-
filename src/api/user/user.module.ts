import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { Users } from '../../config/entity/user.entity';
import { Posts } from '../../config/entity/post.entity';
import { Comments } from '../../config/entity/comment.entity';
import { LocalStrategy } from '../Authentication/stratery/local.stratery';
import { JwtStratery } from '../Authentication/stratery/jwt.stratery';
import { AuthService } from '../Authentication/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { FriendTo } from 'src/config/entity/friends.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Posts, Comments, FriendTo]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    LocalStrategy,
    JwtStratery,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
