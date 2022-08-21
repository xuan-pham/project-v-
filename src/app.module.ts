import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { PostModule } from './api/post/post.module';
import { CommetModule } from './api/commet/commet.module';
import { AuthModule } from './api/Authentication/auth.module';
import { MailModule } from './api/mail/mail.module';
import { ApiTokenCheckMiddleware } from './api/commons/middleware/api-token-check.middleware';
import { GoogleOauthModule } from './api/google-oauth/google-oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    PostModule,
    CommetModule,
    AuthModule,
    MailModule,
    GoogleOauthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
