import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateAccount } from './dto/authentication.dto';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async logIn(request) {
    const { email } = request;
    const checkActive = await this.checkEmailActive(email);
    return this.getCookieWithJwtAccessToken(checkActive);
  }

  async createAccount(data: CreateAccount) {
    const user = await this.userRepository.findByEmail(data.email);
    if (user) {
      throw new BadRequestException('Email exist');
    }
    const hashPass = await this.hashPassword(data.password);
    const createAccount = await this.userRepository.store({
      ...data,
      password: hashPass,
    });
    createAccount.password = undefined;
    return createAccount;
  }

  logOut(res) {
    res.res.setHeader('Set-Cookie', this.getCookieForLogOut());
  }

  private getCookieForLogOut() {
    return `Authentication:`;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userRepository.findByEmail(email);
    await this.verifyPass(pass, user.password);
    const { password, ...result } = user;
    return result;
  }

  private async verifyPass(pass: string, hash) {
    const isMach = await bcrypt.compare(pass, hash);
    if (!isMach) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async hashPassword(pass: string) {
    return await bcrypt.hash(pass, 10);
  }

  async getCookieWithJwtAccessToken(data: any) {
    const { id, email } = data;
    const payload = { id, email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    });
    return { Authentication: token };
  }

  async checkEmailActive(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user.isStatus) {
      throw new BadRequestException(
        'Account is not active,Please check your email again',
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

  async confirmEmail(email) {
    const user = await this.userRepository.findByEmail(email);
    if (user.isStatus) {
      throw new BadRequestException('Email already confirmed');
    }
    await this.markEmailAsConfirmed(email);
  }

  private async markEmailAsConfirmed(email: string) {
    const user = await this.userRepository.findByEmail(email);
    return this.userRepository.confirm(user.id);
  }
}
