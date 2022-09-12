import { Injectable } from '@nestjs/common';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async findAll(data) {
    const [posts, users] = await Promise.all([
      this.postService.getDataQuery(data),
      this.userService.getDataQuery(data),
    ]);
    return { posts, users };
  }
}
