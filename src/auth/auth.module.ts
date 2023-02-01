import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailerTemplate } from '../mail/mail.templates';

@Module({
  imports: [JwtModule.register({}), MailerTemplate],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, MailerTemplate],
})
export class AuthModule {}
