import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    const apps = await this.appService.getHello();
    return { statusCode: HttpStatus.OK, message: 'successful', data: apps };
  }
}
