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
  Patch,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { storagePost } from '../../commons/image/imagePost.image';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from '../../commons/role/guard/role.guard';
import { Role } from '../../commons/role/enum/role.enum';
import { BullsService } from 'src/config/bulls/bulls.service';
import { ProcessService } from '../process/process.service';
@ApiBearerAuth()
@ApiTags('post')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private bullsService: BullsService,
    private processService: ProcessService
  ) {}

  @Get()
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  async index(
    @Query('filter') filter: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ) {
    limit = limit > 100 ? 100 : limit;
    const posts = await this.postService.index(filter, {
      page,
      limit,
    });
    return {
      statusCode: 200,
      message: 'successful',
      data: posts,
    };
  }

  @Get('/:id')
  async show(@Param('id') id: string) {
    const posts = await this.postService.getAllInfo(+id);
    return {
      statusCode: 200,
      message: 'successful',
      data: posts,
    };
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
      storagePost
    )
  )
  async create(
    @Request() req,
    @Body() data: string,
    @UploadedFiles()
    files?: { images: Express.Multer.File[]; videos: Express.Multer.File[] }
  ) {
    const id = req.user.id;
    const process = await this.processService.create();
    await this.bullsService.uploadsImage(+id, +process.id, data, files);
    return { statusCode: 200, message: 'successful', data: process.id };
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
    FileFieldsInterceptor([{ name: 'images' }, { name: 'videos' }], storagePost)
  )
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePostDto,
    @UploadedFiles()
    files?: { images: Express.Multer.File[]; videos: Express.Multer.File[] }
  ) {
    await this.postService.update(+id, data, files);
    return {
      statusCode: HttpStatus.OK,
      message: `Successfully updated`,
      data: {},
    };
  }

  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    this.postService.delete(+id);
    return {
      statusCode: HttpStatus.OK,
      message: `Successfully deleted`,
    };
  }

  @Patch('blocked/:id')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  async blockPost(@Query('id') id: string) {
    await this.postService.blocked(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data: {},
    };
  }

  @Patch('unblocked')
  @UseGuards(RoleGuard(Role.Admin))
  @UseGuards(JwtAuthenticationGuard)
  async unblockPost(@Query('id') id: string) {
    await this.postService.unblocked(+id);
    return {
      status: HttpStatus.OK,
      message: 'successful',
      data: {},
    };
  }
}
