import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from '../commons/base/base.service';
import { Users } from '../../config/entity/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService extends BaseService<Users, UserRepository> {
  constructor(private readonly reponsitory: UserRepository) {
    super(reponsitory);
  }
  async getUserByEmail(email: string) {
    const user = await this.reponsitory.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not exist');
    }
    return user;
  }
}
