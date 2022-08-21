import { ForbiddenException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export class ApiTokenCheckMiddleware implements NestMiddleware {
  constructor(
    private readonly userReponsitory: UserRepository,
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const bearerHeader = req.headers.authorization;
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];
    let user;
    try {
      const data = this.jwt.verify(
        accessToken,
        this.configService.get('JWT_SECRET'),
      );
      console.log(data);
      const userId = data.id;
      console.log(userId);
      user = await this.userReponsitory.findById(userId);
    } catch (error) {
      throw new ForbiddenException('Please register or sign in.');
    }
    if (user) {
      req.user = user;
    }
    next();
  }
}
