import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Process } from '../../config/entity/process.entity';

@Injectable()
export class ProcessRepository {
  constructor(
    @InjectRepository(Process)
    private reponsitory: Repository<Process>
  ) {}

  async create(data) {
    return this.reponsitory.save({ ...data });
  }

  async show(id: number) {
    return this.reponsitory.findOne({ where: { id } });
  }

  async update(id: number, status) {
    // console.log('log >>>>>>' + status.log);
    await this.reponsitory.update(id, {
      status: status.status,
      log: status.log,
    });
  }
}
