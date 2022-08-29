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
import { ChangePassDto, CreateAccount, ForgotPassDto, LoginDto } from './dto/authentication.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthenticationGuard } from './guard/jwt-auth.guard';
import { MailService } from '../mail/mail.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) { }

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
    return `Account activation successful`;
  }

  @Post('forgot-pass')
  async forgotPass(@Body() email: ForgotPassDto) {
    const info = await this.authService.forgotPass(email);
    await this.mailService.sendPassConfirmation(info);
    return 'Please check your email';
  }

  @Post('change-pass')
  async changePass(@Query('token') token: string, @Body() data: ChangePassDto) {
    const email = await this.authService.decodeConfirmationToken(token);
    await this.authService.changePass(email, data);
    return `Change password successfully`;
  }
}
