import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { Users } from '../../config/entity/user.entity';
import { ChangeRole } from '../Authentication/dto/authentication.dto';
import { UpdateUserDto } from './dto/user.dto';

export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>
  ) {}

  getDataUser(id: number) {
    return this.userRepository.find({
      relations: {
        posts: true,
      },
      where: { id },
    });
  }

  findById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  index(
    filter: string,
    option: IPaginationOptions
  ): Promise<Pagination<Users>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.name LIKE :filter', { filter: `%${filter}%` })
      .orWhere('user.email LIKE :filter', { filter: `%${filter}%` });
    queryBuilder.orderBy('user.name').getMany();
    return paginate<Users>(queryBuilder, option);
  }

  store(data: any) {
    return this.userRepository.save(data);
  }

  async update(id: number, data: UpdateUserDto, files: Express.Multer.File) {
    return this.userRepository.update(id, {
      ...data,
      avatar: files.filename,
    } as unknown);
  }

  delete(id: number) {
    return this.userRepository
      .createQueryBuilder()
      .delete()
      .from(Users)
      .where('id = :id', { id });
  }

  confirmEmail(id: number) {
    return this.userRepository.update(id, { isStatus: true });
  }
  confirmPass(id: number, pass: string) {
    return this.userRepository.update(id, { password: pass });
  }

  queryBuilder(data) {
    const builderUser = this.userRepository.createQueryBuilder('user');
    builderUser.where('user.name LIKE :s', { s: `%${data}%` });
    builderUser.orderBy('user.name');
    return builderUser.getMany();
  }

  async changeRoleUser(id: number, data: ChangeRole) {
    const qb = this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set({ role: data.role })
      .where('id = :id', { id })
      .execute();
    return qb;
  }

  async updateRefreshToken(id: number, data: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('user not exist');
    const qb = this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set({
        currentHashedRefreshToken: data,
      })
      .where('id = :id', { id })
      .execute();
    return qb;
  }

  async remoteUpdateRefreshToken(id: number) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('user not exist');
    const qb = this.userRepository
      .createQueryBuilder()
      .update(Users)
      .set({
        currentHashedRefreshToken: null,
      })
      .where('id = :id', { id })
      .execute();
    return qb;
  }
}
