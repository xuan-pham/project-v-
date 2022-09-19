import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from '../entity/user.entity';
import { Posts } from '../entity/post.entity';
import { Comments } from '../entity/comment.entity';
import { FriendTo } from '../entity/friends.entity';
import { Shares } from '../entity/share.entity';
import DatabaseLogger from './databaseLogger';
import { Message } from '../entity/message.entity';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        logger: new DatabaseLogger(),
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [Users, Posts, Comments, FriendTo, Shares, Message],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
