import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/api/mail/mail.module';
import { PostRepository } from 'src/api/post/post.repository';
import { PostService } from 'src/api/post/post.service';
import { Posts } from '../entity/post.entity';
import { Users } from '../entity/user.entity';
import { BullsProcess } from './bulls.process';
import { BullsService } from './bulls.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Posts]),
    MailModule,
    BullModule.registerQueueAsync({
      name: 'process',
    }),
  ],
  providers: [BullsService, BullsProcess, PostService, PostRepository],
  exports: [BullsService],
})
export class BullsModule {}
