import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { GetCurrentUserId } from '../common/decorators';
import { GatewayDto } from './dto';
import { GatewayService } from './gateway.service';

@Controller('chat')
export class GatewayController {
  constructor(private gatewayService: GatewayService) {}

  @Get(':roomId')
  getMessages(
    @GetCurrentUserId() userId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
  ) {
    return this.gatewayService.getRoomMessages(userId, roomId);
  }

  @Post(':roomId')
  sendMessage(
    @GetCurrentUserId() userId: number,
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() dto: GatewayDto,
  ) {
    return this.gatewayService.sendMessage(userId, roomId, dto);
  }
}
