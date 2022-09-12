import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository, DeleteResult } from 'typeorm';
import { Users } from '../../config/entity/user.entity';
import { ChangeRole } from '../Authentication/dto/authentication.dto';
import { UpdateUserDto } from './dto/user.dto';

export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
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
    option: IPaginationOptions,
  ): Promise<Pagination<Users>> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .where('user.name LIKE :filter', { filter: `%${filter}%` })
      .orWhere('user.email LIKE :filter', { filter: `%${filter}%` });
    queryBuilder.orderBy('user.name').getMany();
    return paginate<Users>(queryBuilder, option);
  }

  store(data: any) {
    console.log(typeof data);
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
      .where('id = :id', { id })
      .execute();
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

  changeRoleUser(id: number, data: ChangeRole) {
    console.log('HAHAHA');
    return this.userRepository
      .createQueryBuilder()
      .update()
      .set({
        role: data.role,
      })
      .where('id = :id', { id })
      .execute();
  }

  // updateRefreshToken(id: number, data: string){
  //   return this.userR
  // };
}
