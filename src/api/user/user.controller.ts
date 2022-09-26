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
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../../commons/image/imageProfile.image';
import { RoleGuard } from '../../commons/role/guard/role.guard';
import { Role } from '../../commons/role/enum/role.enum';
import { RequestWithUser } from './user.interface';

@ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  // @UseGuards(JwtAuthenticationGuard)
  async getDataUser(
    @Query('filter') filter: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    limit = limit > 100 ? 100 : limit;
    const users = await this.userService.getUsers(filter, {
      page,
      limit,
    });
    return {
      statusCode: 200,
      message: 'successful',
      data: users,
    };
  }

  @Get('info')
  async show(@Request() req: RequestWithUser) {
    const id = req.user.id;
    const users = await this.userService.getAllInfo(+id);
    return {
      statusCode: 200,
      messages: 'successful',
      data: users,
    };
  }

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
    @UploadedFile() files: Express.Multer.File
  ) {
    const id = req.user.id;
    await this.userService.update(+id, data, files);
    return {
      status: HttpStatus.OK,
      message: 'Successful',
      data: {},
    };
  }

  @Delete('delete/:id')
  async destroy(@Param('id') id: number) {
    await this.userService.delete(+id);
    return {
      status: HttpStatus.OK,
      message: 'Successful',
      data: {},
    };
  }
}
