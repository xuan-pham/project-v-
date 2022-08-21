import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Users } from '../../config/entity/user.entity';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userReponsitory: UserRepository) {}

  async findByEmail(email: string): Promise<Users> {
    return this.userReponsitory.findByEmail(email);
  }

  async index(): Promise<Users[]> {
    const user = await this.userReponsitory.index();
    if (!user) {
      throw new NotFoundException('User not exist');
    }
    return user;
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
    const user = await this.userReponsitory.findAllInfoUserById(id);
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
    return user;
  }

  async update(id: number, data, files) {
    console.log(data);
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
