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
} from '@nestjs/common';
import { PostService } from './post.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storagePost } from '../commons/image/imagePost.image';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { UpdatePostDto } from './dto/updatePost.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  index() {
    return this.postService.index();
  }

  @Get('/:id')
  show(@Param('id') id: string) {
    return this.postService.getAllInfo(+id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 12, storagePost))
  create(
    @Request() req,
    @Body() data,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    const id = req.user.id;
    return this.postService.store(+id, data, images);
  }

  @UseGuards(JwtAuthenticationGuard)
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
  delete(@Param('id') id: string) {
    return this.postService.delete(+id);
  }
}
