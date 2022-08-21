import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './stratery/local.stratery';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../../config/entity/user.entity';
import { UserRepository } from '../user/user.repository';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStratery } from './stratery/jwt.stratery';
@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([Users]),
    ConfigModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UserRepository, JwtStratery],
})
export class AuthModule {}
