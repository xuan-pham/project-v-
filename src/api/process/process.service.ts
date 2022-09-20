import { Injectable } from '@nestjs/common';
import { UpdateProcessDto } from './dto/process.dto';
import { ProcessRepository } from './process.repository';

@Injectable()
export class ProcessService {
  constructor(private processRepository: ProcessRepository) {}

  async create() {
    const data = {
      status: 'Pending',
      log: {},
    };
    return this.processRepository.create(data);
  }

  async show(id: number) {
    return this.processRepository.show(id);
  }

  async update(id: number, data: UpdateProcessDto) {
    await this.processRepository.update(id, data);
  }
}
