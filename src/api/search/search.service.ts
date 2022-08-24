import { BadRequestException, Injectable } from '@nestjs/common';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  async findAll(request) {
    const builderPost = await this.postService.getDataQuery('post');
    if (request.query.s) {
      builderPost.where('post.title LIKE :s', { s: `%${request.query.s}%` });
    }
    const post = await builderPost.getMany();
    if (post.length === 0) {
      throw new BadRequestException('data not exist');
    }
    return { post };
  }
}
