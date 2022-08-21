import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CreateAccount, LoginDto } from './dto/authentication.dto';
import { ApiBody } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.login(req);
  }
  @Post('signup')
  async signUp(@Body() data: CreateAccount) {
    return this.authService.createAccount(data);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  logOut(@Request() req) {
    return this.authService.logOut(req);
  }
}
