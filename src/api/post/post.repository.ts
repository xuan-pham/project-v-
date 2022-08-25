import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../../config/entity/post.entity';
import { DeleteResult, Repository } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

export class PostRepository {
  constructor(
    @InjectRepository(Posts)
    private postRepository: Repository<Posts>,
  ) { }

  findById(id: number) {
    return this.postRepository.findOne({ where: { id } });
  }

  getDataPost(id: number) {
    return this.postRepository.find({
      relations: {
        author: true,
      },
      where: { id },
    });
  }

  index(filter: string, option: IPaginationOptions): Promise<Pagination<Posts>> {
    const queryBuilder = this.postRepository.createQueryBuilder('post');
    queryBuilder.where('post.title LIKE :filter', { filter: `%${filter}%`, })
    queryBuilder.orderBy('post.title', 'DESC')
      .getMany();
    return paginate<Posts>(queryBuilder, option);
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

  queryBuilder(alias: string) {
    return this.postRepository.createQueryBuilder(alias);
  }
}
