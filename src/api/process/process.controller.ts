import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProcessService } from './process.service';

@ApiTags('process')
@Controller('process')
export class ProcessController {
  constructor(private processService: ProcessService) {}

  @Get('/:id')
  async show(@Param('id') id: string) {
    return this.processService.show(+id);
  }
}
