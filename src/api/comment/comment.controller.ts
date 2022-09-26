import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from '../user/user.interface';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
@ApiBearerAuth()
@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  //@Query('page') page: number
  @Get('post/:id')
  async showCommentsByPost(@Param('id') id: string) {
    const comments = await this.commentService.showByPost(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Successful',
      data: comments,
    };
  }

  @Post('post/:id')
  async createComment(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() data: CommentDto
  ) {
    const comments = await this.commentService.create(+id, req, data);
    return {
      statusCode: HttpStatus.OK,
      message: 'Successful',
      data: comments,
    };
  }

  //@Query('page') page: number;
  @Get('user/:id')
  async showCommentsByUser(@Param('id') id: string) {
    const comments = await this.commentService.showByUser(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Successful',
      data: comments,
    };
  }

  @Get(':id')
  async showComment(@Param('id') id: string) {
    const comments = await this.commentService.index(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Successful',
      data: comments,
    };
  }

  @Put('edit-comment/:id')
  async editComment(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() comment: CommentDto
  ) {
    await this.commentService.edit(+id, req, comment);
    return {
      status: HttpStatus.OK,
      message: 'Successful',
      data: {},
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req: Request) {
    await this.commentService.delete(+id, req);
    return {
      status: HttpStatus.OK,
      message: 'Successful',
      data: {},
    };
  }
}
