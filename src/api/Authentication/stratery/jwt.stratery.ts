import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserRepository } from '../../user/user.repository';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadDto } from '../dto/tokenPayload.dto';

@Injectable()
export class JwtStratery extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: TokenPayloadDto) {
    const user = await this.userRepository.findById(payload.id);
    if (!user) {
      throw new NotFoundException('User not exist');
    }
    return user;
  }
}
