import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { PostModule } from './api/post/post.module';
import { CommentModule } from './api/comment/comment.module';
import { AuthModule } from './api/Authentication/auth.module';
import { MailModule } from './api/mail/mail.module';
import { ApiTokenCheckMiddleware } from './commons/middleware/api-token-check.middleware';
import { GoogleOauthModule } from './api/google-oauth/google-oauth.module';
import { MessageModule } from './api/message/message.module';
import { SearchModule } from './api/search/search.module';
import { FriendsModule } from './api/friends/friends-folow.module';
import { SharesModule } from './api/shares/shares.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    PostModule,
    AuthModule,
    MailModule,
    GoogleOauthModule,
    CommentModule,
    MessageModule,
    SearchModule,
    FriendsModule,
    SharesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
