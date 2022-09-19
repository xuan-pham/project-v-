import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PostService } from '../post/post.service';
import { RequestWithUser } from '../user/user.interface';
import { UserService } from '../user/user.service';
import { CommentRepository } from './comment.repository';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  isRealValue = (obj) => {
    return obj && obj !== 'null' && obj !== 'undefined';
  };

  async create(id: number, request: RequestWithUser, data: CommentDto) {
    try {
      const userId = request.user.id;
      const post = await this.postService.getPostById(id);
      const user = await this.userService.findById(userId);
      const comment = {
        ...data,
        post,
        author: user,
      };
      return this.commentRepository.create(comment);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async showByPost(id: number) {
    const comments = await this.commentRepository.findPost(id);
    if (!comments) {
      throw new BadRequestException('Post not exist');
    }
    return comments;
  }

  async showByUser(id: number) {
    const comments = await this.commentRepository.findUser(id);
    if (!comments) {
      throw new BadRequestException('Author not exist');
    }
    return comments;
  }

  async index(id: number) {
    const comments = await this.commentRepository.show(id);
    if (!comments) {
      throw new BadRequestException();
    }
    return comments;
  }

  async delete(id: number, request) {
    const userId = request.user.id;
    const comments = await this.commentRepository.show(id);
    if (comments.author.id !== userId) {
      throw new UnauthorizedException('You do not own this comment');
    }
    return this.commentRepository.delete(comments);
  }

  async edit(id: number, request: RequestWithUser, comment: CommentDto) {
    const userId = request.user.id;
    const user = await this.userService.findById(userId);
    if (user.id !== userId) throw new UnauthorizedException();
    return this.commentRepository.update(id, comment);
  }
}
