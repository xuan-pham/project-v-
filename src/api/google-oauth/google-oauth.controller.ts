import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GoogleOauthService } from './google-oauth.service';

@ApiTags('googleOAuth')
@Controller('google-auth')
export class GoogleOauthController {
  constructor(private readonly googleOAuthService: GoogleOauthService) { }

  @Get()
  @UseGuards(AuthGuard('googleOAuth'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  async googleOAuth(@Request() req) { }

  @Get('auth/google/callback')
  @UseGuards(AuthGuard('googleOAuth'))
  googleAuthRedirect(@Request() req) {
    return this.googleOAuthService.googleLogin(req);
  }
}
