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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { RequestWithUser } from '../user/user.interface';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
@ApiBearerAuth()
@ApiTags('comment')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('post/:id')
  @UseGuards(JwtAuthenticationGuard)
  createComment(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() data: CommentDto,
  ) {
    return this.commentService.create(+id, req, data);
  }

  //@Query('page') page: number
  @Get('post/:id')
  showCommentsByPost(@Param('id') id: string) {
    return this.commentService.showByPost(+id);
  }

  //@Query('page') page: number;
  @Get('user/:id')
  showCommentsByUser(@Param('id') id: string) {
    return this.commentService.showByUser(+id);
  }

  @Get(':id')
  showComment(@Param('id') id: string) {
    return this.commentService.index(+id);
  }

  @Put('edit-comment/:id')
  @UseGuards(JwtAuthenticationGuard)
  async editComment(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() comment: CommentDto,
  ) {
    await this.commentService.edit(+id, req, comment);
    return {
      status: HttpStatus.OK,
      message: 'Comment updated successfully',
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthenticationGuard)
  delete(@Param('id') id: string, @Request() req: Request) {
    return this.commentService.delete(+id, req);
  }
}
