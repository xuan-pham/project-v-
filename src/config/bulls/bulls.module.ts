import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/api/mail/mail.module';
import { PostRepository } from 'src/api/post/post.repository';
import { PostService } from 'src/api/post/post.service';
import { ProcessModule } from 'src/api/process/process.module';
import { ProcessRepository } from '../../api/process/process.repository';
import { Posts } from '../entity/post.entity';
import { Process } from '../entity/process.entity';
import { Users } from '../entity/user.entity';
import { BullsProcess } from './bulls.process';
import { BullsService } from './bulls.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Posts, Process]),
    MailModule,
    ProcessModule,
    BullModule.registerQueueAsync({
      name: 'process',
    }),
  ],
  providers: [
    BullsService,
    BullsProcess,
    PostService,
    PostRepository,
    ProcessRepository,
  ],
  exports: [BullsService],
})
export class BullsModule {}
