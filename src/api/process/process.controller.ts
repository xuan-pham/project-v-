import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProcessService } from './process.service';
@ApiBearerAuth()
@ApiTags('process')
@Controller('process')
export class ProcessController {
  constructor(private processService: ProcessService) {}

  @Get('/:id')
  async show(@Param('id') id: string) {
    const process = await this.processService.show(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data: process,
    };
  }
}
