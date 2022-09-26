import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  ChangePassDto,
  ChangeRole,
  CreateAccount,
  ForgotPassDto,
  LoginDto,
} from './dto/authentication.dto';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async logIn(request: LoginDto) {
    const { email } = request;
    const checkActive = await this.checkEmailActive(email);
    const [accessToken, refreshToken] = await Promise.all([
      this.getCookieWithJwtAccessToken(checkActive),
      this.getCookieWithJwtRefreshToken(checkActive),
    ]);
    const userId = checkActive.id;
    await this.userRepository.updateRefreshToken(userId, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
  }

  async logOut(id: number) {
    return this.userRepository.remoteUpdateRefreshToken(id);
  }

  async createAccount(data: CreateAccount) {
    const user = await this.userRepository.findByEmail(data.email);
    if (user) {
      throw new BadRequestException('Email exist');
    }
    const hashPass = await this.hashPassword(data.password);
    return this.userRepository.store({
      ...data,
      password: hashPass,
    });
  }

  private getCookieForLogOut() {
    return `Authentication:`;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found,Please SignUp');
    }
    await this.verifyPass(pass, user.password);
    const { password, ...result } = user;
    return result;
  }

  private async verifyPass(pass: string, hash: string) {
    const isMach = await bcrypt.compare(pass, hash);
    if (!isMach) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async hashPassword(pass: string) {
    return await bcrypt.hash(pass, 10);
  }

  async getCookieWithJwtAccessToken(data) {
    const { id, email, name } = data;
    const payload = { id, email, name };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
  }

  public getCookieWithJwtRefreshToken(data) {
    const { id, email, name } = data;
    const payload = { id, email, name };
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
  }

  async checkEmailActive(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user.isStatus) {
      throw new BadRequestException(
        'Account is not active,Please check your email again'
      );
    }
    delete user.password;
    return user;
  }

  async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async confirmEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (user.isStatus) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.markEmailAsConfirmed(email);
  }

  private async markEmailAsConfirmed(email: string) {
    const user = await this.userRepository.findByEmail(email);
    return this.userRepository.confirmEmail(user.id);
  }

  async forgotPass(data: ForgotPassDto) {
    const { email } = data;
    const check = await this.userRepository.findByEmail(email);
    if (!check) {
      throw new NotFoundException(`Email is not correct`);
    }
    return email;
  }

  async changePass(email: string, data: ChangePassDto) {
    const pass = data.password;
    const passConfirm = data.passwordConfirm;
    if (pass !== passConfirm) {
      throw new BadRequestException('password is not matched');
    }
    const hash = await this.hashPassword(pass);
    return this.markPasslAsConfirmed(email, hash);
  }
  private async markPasslAsConfirmed(email: string, pass: string) {
    const user = await this.userRepository.findByEmail(email);
    return this.userRepository.confirmPass(user.id, pass);
  }

  async changeRole(id: number, data: ChangeRole, roleId: number) {
    const user = await this.userRepository.findById(id);
    if (user.id === roleId)
      throw new BadRequestException('User canrt not change role your account');
    if (!user) throw new NotFoundException('User not exist');
    return this.userRepository.changeRoleUser(id, data);
  }
}
