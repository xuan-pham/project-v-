import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtRefreshGuard } from './guard/jwt-refresh.guard';
import { JwtAuthenticationGuard } from './guard/jwt-auth.guard';
import { RequestWithUser } from '../user/user.interface';
import { RoleGuard } from 'src/commons/role/guard/role.guard';
import { Role } from 'src/commons/role/enum/role.enum';
import { BullsService } from 'src/config/bulls/bulls.service';
import { Public } from '../../commons/public-route/public-key';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private bullsService: BullsService,
    private readonly authService: AuthService
  ) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.logIn(req.user);
  }

  @Public()
  @Post('signup')
  async signUp(@Body() data: CreateAccount) {
    await this.authService.createAccount(data);
    await this.bullsService.sendMailBull(data.email);
    return {
      statusCode: HttpStatus.OK,
      message: `Please check your email to activate your account`,
    };
  }

  @ApiBearerAuth()
  @Post('logout')
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() request: RequestWithUser) {
    const id = request.user.id;
    await this.authService.logOut(+id);
    return;
  }

  @Public()
  @Get('confirm')
  async confirm(@Query('token') token: string) {
    const email = await this.authService.decodeConfirmationToken(token);
    await this.authService.confirmEmail(email);
    return {
      statusCode: HttpStatus.OK,
      message: 'Your email has been confirmed successfully',
    };
  }

  @Public()
  @Post('forgot-pass')
  async forgotPass(@Body() email: ForgotPassDto) {
    const info = await this.authService.forgotPass(email);
    await this.bullsService.sendForgotBull(info);
    return { statusCode: 200, message: 'Please check your email' };
  }

  @Public()
  @Post('change-pass')
  async changePass(@Query('token') token: string, @Body() data: ChangePassDto) {
    const email = await this.authService.decodeConfirmationToken(token);
    await this.authService.changePass(email, data);
    return {
      statusCode: HttpStatus.OK,
      message: `Successful`,
      data: {},
    };
  }

  @ApiBearerAuth()
  @Post('change-role/:id')
  @UseGuards(RoleGuard(Role.Admin))
  async changeRole(
    @Param('id') id: string,
    @Body() data: ChangeRole,
    @Req() req: RequestWithUser
  ) {
    const roleId = req.user.id;
    await this.authService.changeRole(+id, data, +roleId);
    return {
      statusCode: HttpStatus.OK,
      messages: 'Successful',
      data: {},
    };
  }

  @ApiBearerAuth()
  @Get('refresh')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req: RequestWithUser) {
    const accessTokenCookie =
      await this.authService.getCookieWithJwtAccessToken(req.user);
    return { accessTokenCookie };
  }
}
