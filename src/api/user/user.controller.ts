import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { Users } from '../../config/entity/user.entity';
import { DeleteResult } from 'typeorm';
import { UserService } from './user.service';
import { UpdateDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  index(): Promise<Users[]> {
    return this.userService.index();
  }

  @Get('/:id')
  show(@Param('id') id: number): Promise<Users> {
    return this.userService.findById(+id);
  }

  @Put()
  update(@Query('id') id: number, @Body() data: UpdateDto): Promise<Users> {
    return this.userService.update(+id, data);
  }

  @Delete('/:id')
  destroy(@Param('id') id: number): Promise<DeleteResult> {
    return this.userService.delete(+id);
  }
}
