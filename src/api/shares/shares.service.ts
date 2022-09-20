import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../post/post.repository';
import { UserRepository } from '../user/user.repository';
import { SharesReponsitory } from './shares.reponsitory';

@Injectable()
export class SharesService {
  constructor(
    private shareRepository: SharesReponsitory,
    private userRepository: UserRepository,
    private postRepository: PostRepository,
  ) {}

  getList(postId: number) {
    return this.shareRepository.list(postId);
  }

  async add(id: number, userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException('Post not found ');
    return this.shareRepository.add(id, userId);
  }
}
