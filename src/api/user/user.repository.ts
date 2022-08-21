import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { EntityId } from 'typeorm/repository/EntityId';
import { Users } from '../../config/entity/user.entity';

export class UserRepository {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}
  findAllInfoUserById(id: number) {
    return this.userRepository.find({
      relations: {
        posts: true,
      },
      where: { id },
    });
  }

  findById(id: EntityId) {
    return this.userRepository.findOneById(id);
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  index() {
    return this.userRepository.find();
  }

  store(data) {
    return this.userRepository.save(data);
  }

  async update(id: EntityId, data: any, files) {
    await this.userRepository.update(id, {
      ...data,
      avatar: files.filename,
    });
    return this.findById(id);
  }

  delete(id: EntityId): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
