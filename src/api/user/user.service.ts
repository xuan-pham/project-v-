import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Users } from '../../config/entity/user.entity';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/user.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';


@Injectable()
export class UserService {
  paginate(arg0: {}): Promise<Pagination<Users, import("nestjs-typeorm-paginate").IPaginationMeta>> {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly userReponsitory: UserRepository) { }

  async findByEmail(email: string): Promise<Users> {
    return this.userReponsitory.findByEmail(email);
  }

  async getUsers(filter: string, options: IPaginationOptions) {
    const queryBuilder = await this.userReponsitory.index(filter, options);
    if (!queryBuilder) {
      throw new NotFoundException('User not exist');
    }
    return queryBuilder;

  }
  //
  // async store(data) {
  //   const user = await this.userReponsitory.store(data);
  //   if (!user) {
  //     throw new BadRequestException(`Can't create user`);
  //   }
  //   return user;
  // }
  async getAllInfo(id: number) {
    const user = await this.userReponsitory.getDataUser(id);
    if (!user) {
      throw new BadRequestException('User not exist');
    }
    return user;
  }

  async findById(id: number) {
    const user = await this.userReponsitory.findById(id);
    if (!user) {
      throw new NotFoundException('User not exist');
    }
    delete user.password;
    return user;
  }

  async update(id: number, data, files) {
    const user = await this.userReponsitory.update(+id, data, files);
    if (!user) {
      throw new BadRequestException(`Can't update user`);
    }
    return user;
  }

  async delete(id: number) {
    return this.userReponsitory.delete(id);
  }

  async createWithGoogle(data) {
    try {
      const newUser = {
        email: data.email,
        avatar: data.avatar,
        isStatus: true,
        isRegisteredWithGoogle: true,
      };
      return this.userReponsitory.store(newUser);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
