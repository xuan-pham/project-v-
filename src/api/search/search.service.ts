import { BadRequestException, Injectable } from '@nestjs/common';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly postService: PostService,
  ) { }

  async findAll(data) {
    const builderPost = await this.postService.getDataQuery('post');
    if (data) {
      builderPost.where('post.title LIKE :s', { s: `%${data}%` });
    }
    const post = await builderPost.getMany();
    if (post.length === 0) {
      throw new BadRequestException('data not exist');
    }
    return { post };
  }
}
