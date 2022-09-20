import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ProcessRepository } from '../process/process.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postReponsitory: PostRepository,
    private processRepository: ProcessRepository,
  ) {}

  async index(filter: string, options: IPaginationOptions) {
    const queryBuilder = await this.postReponsitory.index(filter, options);
    if (!queryBuilder) {
      throw new NotFoundException('Post not exist');
    }
    return queryBuilder;
  }

  // async store(
  //   id: number,
  //   data: string,
  //   files?: { images: Express.Multer.File[]; videos: Express.Multer.File[] },
  // ) {
  //   const nameFilesImages = await files.images.map(({ filename }) => {
  //     return filename;
  //   }, []);
  //   if (nameFilesImages.length > 12)
  //     throw new BadRequestException(
  //       'Exceed the allowable quantity, less than 12',
  //     );
  //   const nameFilesVideos = await files.videos.map(({ filename }) => {
  //     return filename;
  //   }, []);
  //   if (nameFilesVideos.length > 5)
  //     throw new BadRequestException(
  //       'exceed the allowable quantity, less than 5',
  //     );

  //   const post = await this.postReponsitory.store(
  //     id,
  //     data,
  //     nameFilesImages,
  //     nameFilesVideos,
  //   );
  //   if (post.length === 0) {
  //     throw new BadRequestException(`Can't create post`);
  //   }
  //   return post;
  // }

  async store(idProcess: number, data) {
    try {
      const check = await this.postReponsitory.store(data);
      if (check) {
        const status = {
          status: 'Done',
          log: {},
        };
        await this.processRepository.update(+idProcess, status);
      }
    } catch (error) {
      if (error) {
        const status = {
          status: 'Error',
          log: { error },
        };
        await this.processRepository.update(+idProcess, status);
      }
    }
  }

  async update(
    id: number,
    data: UpdatePostDto,
    files?: { images: Express.Multer.File[]; videos: Express.Multer.File[] },
  ) {
    const nameFilesImages = await files.images.map(({ filename }) => {
      return filename;
    }, []);

    const nameFilesVideos = await files.videos.map(({ filename }) => {
      return filename;
    }, []);
    await this.postReponsitory.update(
      id,
      data,
      nameFilesImages,
      nameFilesVideos,
    );
    return {
      status: HttpStatus.OK,
      message: 'successful update',
    };
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

  async blocked(id: number) {
    const post = await this.postReponsitory.findById(id);
    if (post.isBlocked === true) throw new BadRequestException('locked');
    return this.postReponsitory.blocked(id);
  }

  async unblocked(id: number) {
    const post = await this.postReponsitory.findById(id);
    if (post.isBlocked === false) throw new BadRequestException('unblock');
    return this.postReponsitory.unblocked(id);
  }
}
