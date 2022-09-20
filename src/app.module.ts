import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './api/user/user.module';
import { PostModule } from './api/post/post.module';
import { CommentModule } from './api/comment/comment.module';
import { AuthModule } from './api/Authentication/auth.module';
import { MailModule } from './api/mail/mail.module';
import { GoogleOauthModule } from './api/google-oauth/google-oauth.module';
import { MessageModule } from './api/message/message.module';
import { SearchModule } from './api/search/search.module';
import { FriendsModule } from './api/friends/friends-folow.module';
import { SharesModule } from './api/shares/shares.module';
import { BullModule } from '@nestjs/bull';
import { BullsModule } from './config/bulls/bulls.module';

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
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
