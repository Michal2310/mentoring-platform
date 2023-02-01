import { Injectable, Redirect, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GatewayDto } from './dto';

@Injectable()
export class GatewayService {
  constructor(private prisma: PrismaService) {}
  async getRoomMessages(userId: number, roomId: number) {
    try {
      const room = await this.prisma.messages.findMany({
        where: {
          roomId,
          userId,
        },
      });
      if (!room) return Redirect('http://localhost:3001');
      return room;
    } catch (error) {
      throw error;
    }
  }
  async sendMessage(userId: number, roomId: number, dto: GatewayDto) {
    try {
      await this.prisma.messages.create({
        data: {
          message: dto.message,
          userId,
          roomId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async getAvaivableRooms(userId: number) {
    try {
      return this.prisma.rooms.findMany({
        where: {
          users: {
            every: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
