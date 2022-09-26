import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comments } from '../../config/entity/comment.entity';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comments)
    private readonly commentRepository: Repository<Comments>
  ) {}

  async findPost(id: number) {
    const post = this.commentRepository.find({
      where: { post: { id } },
      relations: ['author'],
    });
    return post;
  }

  async findUser(id: number) {
    return this.commentRepository.find({
      where: { author: { id } },
      relations: ['post'],
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

  async update(id: number, data: CommentDto) {
    const commentId = await this.commentRepository.findOne({ where: { id } });
    if (!commentId) throw new NotFoundException(`Comment ${id} not found`);
    const qb = await this.commentRepository
      .createQueryBuilder()
      .update(Comments)
      .set({ comment: data.comment })
      .where('id =:id', { id })
      .execute();
    return qb;
  }
}
