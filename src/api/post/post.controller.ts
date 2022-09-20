import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storagePost } from '../../commons/image/imagePost.image';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Posts } from '../../config/entity/post.entity';

import { RoleGuard } from '../../commons/role/guard/role.guard';
import { Role } from '../../commons/role/enum/role.enum';
import { BullsService } from 'src/config/bulls/bulls.service';
@ApiBearerAuth()
@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private bullsService: BullsService,
  ) {}

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  index(
    @Query('filter') filter: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.postService.index(filter, {
      page,
      limit,
    });
  }

  @Get('/:id')
  show(@Param('id') id: string): Promise<Posts[]> {
    return this.postService.getAllInfo(+id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        images: {
          type: 'array', // 👈  array of files
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 12 },
        { name: 'videos', maxCount: 5 },
      ],
      storagePost,
    ),
  )
  async create(
    @Request() req,
    @Body() data: string,
    @UploadedFiles()
    files?: { images: Express.Multer.File[]; videos: Express.Multer.File[] },
  ) {
    const id = req.user.id;
    await this.bullsService.uploadsImage(+id, data, files);
    return {
      status: HttpStatus.OK,
      message: `Successfully created`,
    };
  }

  @UseGuards(JwtAuthenticationGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        files: {
          type: 'array', // 👈  array of files
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @Put('update/:id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'images' }, { name: 'videos' }],
      storagePost,
    ),
  )
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePostDto,
    @UploadedFiles()
    files?: { images: Express.Multer.File[]; videos: Express.Multer.File[] },
  ) {
    await this.postService.update(+id, data, files);
    return {
      status: HttpStatus.OK,
      message: `Successfully updated`,
    };
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    this.postService.delete(+id);
    return {
      status: HttpStatus.OK,
      message: `Successfully deleted`,
    };
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Post('blocked')
  async blockPost(@Query('id') id: string) {
    await this.postService.blocked(+id);
    return {
      status: HttpStatus.OK,
      message: 'successful',
    };
  }

  @UseGuards(RoleGuard(Role.Admin))
  @Post('unblocked')
  async unblockPost(@Query('id') id: string) {
    await this.postService.unblocked(+id);
    return {
      status: HttpStatus.OK,
      message: 'successful',
    };
  }
}
