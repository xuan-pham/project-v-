import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../../config/entity/comment.entity';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>,
  ) {}

  async findPost(id: number) {
    return this.commentRepository.find({
      where: { post: { id } },
      relations: ['author', 'post'],
    });
  }

  async findUser(id: number) {
    return this.commentRepository.find({
      where: { author: { id } },
      relations: ['author', 'post'],
    });
  }

  async create(data) {
    return this.commentRepository.save(data);
  }

  async show(id: number) {
    return this.commentRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });
  }

  async delete(data) {
    return this.commentRepository.remove(data);
  }
}
