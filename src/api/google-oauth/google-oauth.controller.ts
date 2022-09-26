import {
  Controller,
  Get,
  HttpStatus,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../commons/public-route/public-key';
import { GoogleOauthService } from './google-oauth.service';

@ApiTags('googleOAuth')
@Controller('google-auth')
export class GoogleOauthController {
  constructor(private readonly googleOAuthService: GoogleOauthService) {}
  @Public()
  @Get()
  @UseGuards(AuthGuard('googleOAuth'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  async googleOAuth(@Request() req) {}

  @Public()
  @Get('auth/google/callback')
  @UseGuards(AuthGuard('googleOAuth'))
  async googleAuthRedirect(@Request() req) {
    const googles = await this.googleOAuthService.googleLogin(req);
    return {
      statusCode: HttpStatus.OK,
      message: 'successful',
      data: googles,
    };
  }
}
