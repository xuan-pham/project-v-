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
} from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storagePost } from '../../commons/image/imagePost.image';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Posts } from '../../config/entity/post.entity';
import { DeleteResult } from 'typeorm';
import { RoleGuard } from '../../commons/role/guard/role.guard';
import { Role } from '../../commons/role/enum/role.enum';
@ApiBearerAuth()
@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  index(
    @Query('filter') filter: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.postService.index(filter, {
      page, limit
    })
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
  @UseInterceptors(FilesInterceptor('images', 12, storagePost))
  create(
    @Request() req,
    @Body() data: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<Posts> {
    const id = req.user.id;
    return this.postService.store(+id, data, images);
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
  @UseInterceptors(FilesInterceptor('files', 12, storagePost))
  update(
    @Param('id') id: string,
    @Body() data: UpdatePostDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.postService.update(+id, data, files);
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string): Promise<DeleteResult> {
    return this.postService.delete(+id);
  }
}
