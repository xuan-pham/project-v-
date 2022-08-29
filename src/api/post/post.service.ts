import {
  BadRequestException,
  HttpCode,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class PostService {
  constructor(private readonly postReponsitory: PostRepository) { }

  async index(filter: string, options: IPaginationOptions) {
    const queryBuilder = await this.postReponsitory.index(filter, options);
    if (!queryBuilder) {
      throw new NotFoundException('Post not exist');
    }
    return queryBuilder;
  }

  async store(id: number, data, images) {
    const nameFiles = images.map(({ filename }) => {
      return filename;
    }, []);
    const post = await this.postReponsitory.store(id, data, nameFiles);
    if (post.length === 0) {
      throw new BadRequestException(`Can't create post`);
    }
    return post;
  }

  async update(id: number, data, files) {
    const nameFiles = files.map(({ filename }) => {
      return filename;
    });
    await this.postReponsitory.update(id, data, nameFiles);
    return {
      status: HttpStatus.OK,
      message: 'successful update'
    }
  }

  async delete(id: number) {
    return this.postReponsitory.delete(id);
  }

  async getAllInfo(id: number) {
    const post = await this.postReponsitory.getDataPost(id);
    if (post.length === 0) {
      throw new BadRequestException('Post not exist');
    }
    return post;
  }

  async getPostById(id: number) {
    const post = await this.postReponsitory.findById(id);
    if (!post) {
      throw new BadRequestException('Post not exist');
    }
    return post;
  }

  async getDataQuery(data) {
    return this.postReponsitory.queryBuilder(data);
  }
}
