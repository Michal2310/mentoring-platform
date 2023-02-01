import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MentorModule } from './mentors/mentor.module';
import { AbilityModule } from './ability/ability.module';
import { MentorshipModule } from './mentorship/mentorship.module';
import { UploadModule } from './upload/upload.module';
import { MulterModule } from '@nestjs/platform-express';
import { AccountModule } from './account/account.module';
import { MailModule } from './mail/mail.module';
import { ChatModule } from './gateway/gateway.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      dest: './files',
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 600000,
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    PrismaModule,
    MailModule,
    MentorModule,
    AbilityModule,
    MentorshipModule,
    UploadModule,
    AccountModule,
    ChatModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
