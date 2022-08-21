import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../../config/entity/post.entity';
import { DeleteResult, Repository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';

export class PostRepository {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
  ) {}

  findById(id: number) {
    return this.postRepository.findOneById(id);
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

  index() {
    return this.postRepository.find();
  }

  store(id, data, nameFiles) {
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

  delete(id: EntityId): Promise<DeleteResult> {
    return this.postRepository.delete(id);
  }
}
