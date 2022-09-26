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
import { CreateFriends } from './dto/friends.dto';
import { FriendsService } from './friends-folow.service';

@ApiBearerAuth()
@ApiTags('friends-folow')
@Controller('friends-folow')
export class FriendsController {
  constructor(private friendService: FriendsService) {}

  @Get('/')
  @UseGuards(JwtAuthenticationGuard)
  async getList(@Request() req: RequestWithUser) {
    const userId = req.user.id;
    const friends = await this.friendService.getListFolow(+userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data: friends,
    };
  }

  @Post('add-friends')
  @UseGuards(JwtAuthenticationGuard)
  async addFriend(
    @Request() req: RequestWithUser,
    @Body() friendId: CreateFriends
  ) {
    const userId = req.user.id;
    const id = friendId.id;
    await this.friendService.addFriend(+userId, +id);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
    };
  }

  @Put('accept-friends/:id')
  @UseGuards(JwtAuthenticationGuard)
  async acceptFriend(@Param('id') id: string) {
    await this.friendService.acceptFriend(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
    };
  }

  @Delete('delete/:id')
  async deleteFriend(@Param('id') id: string) {
    await this.friendService.removeFriend(+id);
    return {
      status: HttpStatus.OK,
      message: 'successful',
    };
  }
}
