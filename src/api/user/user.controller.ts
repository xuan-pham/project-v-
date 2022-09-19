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
  HttpStatus,
} from '@nestjs/common';
import { Users } from '../../config/entity/user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../../commons/image/imageProfile.image';
import { RoleGuard } from '../../commons/role/guard/role.guard';
import { Role } from '../../commons/role/enum/role.enum';
import { Pagination } from 'nestjs-typeorm-paginate';
import { RequestWithUser } from './user.interface';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  getDataUser(
    @Query('filter') filter: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<Users>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.getUsers(filter, {
      page,
      limit,
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('info')
  show(@Request() req: RequestWithUser): Promise<Users[]> {
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
  async update(
    @Request() req: RequestWithUser,
    @Body() data: UpdateUserDto,
    @UploadedFile() files: Express.Multer.File,
  ) {
    const id = req.user.id;
    await this.userService.update(+id, data, files);
    return {
      status: HttpStatus.OK,
      message: 'successful update',
    };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete('delete/:id')
  async destroy(@Param('id') id: number) {
    await this.userService.delete(+id);
    return {
      status: HttpStatus.OK,
      message: 'Successful Delete',
    };
  }
}
