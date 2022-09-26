import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from '../Authentication/guard/jwt-auth.guard';
import { RequestWithUser } from '../user/user.interface';
import { CreateShareDto } from './dto/shares.dto';
import { SharesService } from './shares.service';

@ApiBearerAuth()
@ApiTags('shares')
@Controller('shares')
export class SharesController {
  constructor(private shareService: SharesService) {}

  @Get('/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getShare(@Query('id') id: string) {
    const shares = await this.shareService.getList(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data: shares,
    };
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async add(@Body() data: CreateShareDto, @Request() req: RequestWithUser) {
    const userId = req.user.id;
    const id = data.id;
    await this.shareService.add(+id, userId);
    return {
      status: HttpStatus.OK,
      message: 'successful',
    };
  }
}
