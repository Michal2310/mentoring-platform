import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccountService } from '../account/account.service';
import { ChatGateway } from './gateway';
import { GatewayService } from './gateway.service';

@Module({
  providers: [GatewayService, ChatGateway, AccountService, JwtService],
})
export class ChatModule {}
