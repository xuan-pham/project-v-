import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { Users } from '../../config/entity/user.entity';
import { DeleteResult } from 'typeorm';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { CreateAccount } from '../Authentication/dto/authentication.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../commons/image/imageProfile.image';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  index(): Promise<Users[]> {
    return this.userService.index();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('/:id')
  show(@Param('id') id: number): Promise<Users[]> {
    return this.userService.getAllInfo(+id);
  }

  // @Post('create')
  // create(@Body() data: CreateAccount) {
  //   return this.userService.store(data);
  // }

  @UseGuards(JwtAuthenticationGuard)
  @Put('update')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        comment: { type: 'string' },
        outletId: { type: 'integer' },
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('files', storage))
  update(
    @Request() req,
    @Body() data: UpdateUserDto,
    @UploadedFile() files: Express.Multer.File,
  ): Promise<Users> {
    const id = req.user.id;
    return this.userService.update(+id, data, files);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete('delete/:id')
  destroy(@Param('id') id: number): Promise<DeleteResult> {
    return this.userService.delete(+id);
  }
}
