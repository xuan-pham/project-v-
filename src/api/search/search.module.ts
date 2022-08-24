import { Module } from '@nestjs/common';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [PostModule, UserModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
