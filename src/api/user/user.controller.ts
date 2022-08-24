import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { Users } from '../../config/entity/user.entity';
import { DeleteResult } from 'typeorm';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../commons/image/imageProfile.image';
import { RoleGuard } from '../commons/role/guard/role.guard';
import { Role } from '../commons/role/enum/role.enum';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  index(): Promise<Users[]> {
    return this.userService.index();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('info')
  show(@Request() req): Promise<Users[]> {
    const id = req.user.id;
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
