import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Repository, DeleteResult } from 'typeorm';
import { Users } from '../../config/entity/user.entity';
import { UpdateUserDto } from './dto/user.dto';

export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) { }

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

  index(filter: string, option: IPaginationOptions): Promise<Pagination<Users>> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    queryBuilder.where('user.name LIKE :filter', { filter: `%${filter}%`, })
      .orWhere('user.email LIKE :filter', { filter: `%${filter}%`, })
    queryBuilder.orderBy('user.name', 'DESC')
      .getMany();
    return paginate<Users>(queryBuilder, option);
  }

  store(data: any) {
    return this.userRepository.save(data);
  }

  async update(id: number, data, files: Express.Multer.File) {
    return this.userRepository.update(id, {
      ...data,
      avatar: files.filename,
    });
  }

  delete(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  confirmEmail(id: number) {
    return this.userRepository.update(id, { isStatus: true });
  }
  confirmPass(id: number, pass: string) {
    return this.userRepository.update(id, { password: pass });
  }

  queryBuilder(data) {
    const builderUser = this.userRepository.createQueryBuilder('user');
    builderUser.where('user.name LIKE :s', { s: `%${data}%` })
    builderUser.orderBy('user.name', 'DESC')
    return builderUser.getMany();
  }
}
