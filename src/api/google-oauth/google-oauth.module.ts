import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../Authentication/auth.module';
import { UserModule } from '../user/user.module';
import { GoogleOauthController } from './google-oauth.controller';
import { GoogleOauthService } from './google-oauth.service';
import { GoogleOAuthStrategy } from './strategy/googleOAuth.strategy';

@Module({
  imports: [ConfigModule, AuthModule, UserModule],
  controllers: [GoogleOauthController],
  providers: [GoogleOauthService, GoogleOAuthStrategy],
})
export class GoogleOauthModule {}
