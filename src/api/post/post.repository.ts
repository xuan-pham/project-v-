import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../../config/entity/post.entity';
import { DeleteResult, Repository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';

export class PostRepository {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
  ) {}

  async findById(id: number) {
    return this.postRepository.findOne({ where: { id } });
  }

  async findAllDataPostById(id: number) {
    const post = await this.postRepository.find({
      relations: {
        author: true,
      },
      where: { id },
    });
    return post;
  }

  async index() {
    return this.postRepository.find();
  }

  async store(id, data, nameFiles) {
    return this.postRepository.save({
      ...data,
      author: id,
      image: nameFiles,
    });
  }

  async update(id: number, data, nameFiles) {
    await this.postRepository.update(id, {
      ...data,
      image: nameFiles,
    });
    return this.findById(id);
  }

  async delete(id: EntityId): Promise<DeleteResult> {
    return this.postRepository.delete(id);
  }
}
