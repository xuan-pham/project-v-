import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { Posts } from '../../config/entity/post.entity';

@Injectable()
export class PostService {
  constructor(private readonly postReponsitory: PostRepository) {}

  async index(): Promise<Posts[]> {
    const post = await this.postReponsitory.index();
    if (!post) {
      throw new NotFoundException('Post not exist');
    }
    return post;
  }

  async store(id: number, data, images) {
    const nameFiles = images.map(({ filename }) => {
      return filename;
    }, []);
    const post = await this.postReponsitory.store(id, data, nameFiles);
    if (!post) {
      throw new BadRequestException(`Can't create post`);
    }
    return post;
  }

  async update(id: number, data, files) {
    const nameFiles = files.map(({ filename }) => {
      return filename;
    });
    const post = await this.postReponsitory.update(id, data, nameFiles);
    if (!post) {
      throw new BadRequestException(`Can't update post`);
    }
    return post;
  }

  async delete(id: number) {
    return this.postReponsitory.delete(id);
  }

  async getAllInfo(id: number) {
    const post = await this.postReponsitory.findAllDataPostById(id);
    if (!post) {
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

  async getDataQuery(alias: string) {
    return this.postReponsitory.queryBuilder(alias);
  }
}
