import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('post/:id')
  @UseGuards(JwtAuthenticationGuard)
  createComment(@Param('id') id: string, @Request() req, @Body() data) {
    return this.commentService.create(+id, req, data);
  }

  //@Query('page') page: number
  @Get('post/:id')
  showCommentsByPost(@Param('id') id: string) {
    return this.commentService.showByPost(+id);
  }

  //   @Query('page') page: number;
  @Get('user/:id')
  showCommentsByUser(@Param('id') id: string) {
    return this.commentService.showByUser(+id);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    return this.commentService.index(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  delete(@Param('id') id: string, @Request() req) {
    return this.commentService.delete(+id, req);
  }
}
