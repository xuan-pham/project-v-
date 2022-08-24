import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { CreateAccount, LoginDto } from './dto/authentication.dto';
import { ApiBody } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from './guard/jwt-auth.guard';
import { MailService } from '../mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.logIn(req.user);
  }
  @Post('signup')
  async signUp(@Body() data: CreateAccount) {
    await this.authService.createAccount(data);
    // await this.mailService.sendUserConfirmation(data.email);
    return `Please check your email to activate your account`;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  logOut(@Request() req) {
    return this.authService.logOut(req);
  }

  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const email = await this.authService.decodeConfirmationToken(token);
    await this.authService.confirmEmail(email);
    return `account activation successful`;
  }
}
