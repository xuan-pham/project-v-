import { EntityRepository, Repository } from 'typeorm';
import { Users } from '../../config/entity/user.entity';

@EntityRepository(Users)
export class UserRepository extends Repository<Users> {
  getActiveUsers(): Promise<Users[]> {
    return this.createQueryBuilder()
      .where('isStatus=:active', { active: false })
      .getMany();
  }

  findByEmail(email: string): Promise<Users> {
    return this.createQueryBuilder().where(email).getOne();
  }
}
