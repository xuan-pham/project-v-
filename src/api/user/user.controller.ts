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
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { Users } from '../../config/entity/user.entity';
import { DeleteResult } from 'typeorm';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../../commons/image/imageProfile.image';
import { RoleGuard } from '../../commons/role/guard/role.guard';
import { Role } from '../../commons/role/enum/role.enum';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  getDataUser(
    @Query('filter') filter: string | '',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Users>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.getUsers(filter, {
      page, limit
    })
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
        phone: { type: 'string' },
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
  ) {
    const id = req.user.id;
    return this.userService.update(+id, data, files);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete('delete/:id')
  destroy(@Param('id') id: number): Promise<DeleteResult> {
    return this.userService.delete(+id);
  }
}
