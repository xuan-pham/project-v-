import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import {
  ChangePassDto,
  ChangeRole,
  CreateAccount,
  ForgotPassDto,
  LoginDto,
} from './dto/authentication.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';
import { RoleGuard } from 'src/commons/role/guard/role.guard';
import { Role } from 'src/commons/role/enum/role.enum';

@ApiTags('auth')
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
    await this.mailService.sendUserConfirmation(data.email);
    return `Please check your email to activate your account`;
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

  @Post('change-role/:id')
  // @UseGuards(RoleGuard(Role.Admin))
  async changeRole(@Param('id') id: string, @Body() data: ChangeRole) {
    console.log(id);
    await this.authService.changeRole(+id, data);
    return {
      status: HttpStatus.OK,
      messages: 'Change role successfully',
    };
  }
}
