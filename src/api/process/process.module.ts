import { Module } from '@nestjs/common';
import { ProcessService } from './process.service';
import { ProcessController } from './process.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Process } from 'src/config/entity/process.entity';
import { ProcessRepository } from './process.repository';
import { Posts } from 'src/config/entity/post.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Process, Posts])],
  providers: [
    ProcessService,
    ProcessRepository,
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
  ],
  controllers: [ProcessController],
  exports: [ProcessService],
})
export class ProcessModule {}
