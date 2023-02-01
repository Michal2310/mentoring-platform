import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Server } from 'ws';
import { AccountService } from '../account/account.service';
import { CallDto, GatewayDto } from './dto';
import { GatewayService } from './gateway.service';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private gatewayService: GatewayService,
    private jwtService: JwtService,
    private accountService: AccountService,
  ) {}
  @WebSocketServer()
  server: Server;
  handleDisconnect(socket: Socket) {
    return socket.disconnect();
  }
  async handleConnection(socket: Socket) {
    const jwt = socket.handshake.headers['authorization'].split(' ')[1];
    const { sub } = this.jwtService.decode(jwt);
    if (!sub) return this.handleDisconnect(socket);

    const user = await this.accountService.getUserAccount(sub);
    const rooms = await this.gatewayService.getAvaivableRooms(sub);
    socket.data.user = user;
    socket.data.rooms = rooms;
  }

  @SubscribeMessage('join-room')
  async onJoinRoom(socket: Socket, roomId: number) {
    const messages = await this.gatewayService.getRoomMessages(socket.data.user.sub, roomId);
    socket.data.rooms.activeRoom = roomId;
    socket.join(roomId.toString());
    this.server.to(roomId.toString()).emit('messages', messages);
  }

  @SubscribeMessage('leave-room')
  async onLeaveRoom(socket: Socket) {
    delete socket.data.rooms.activeRoom;
  }

  @SubscribeMessage('new-message')
  async onNewMessage(client: Socket, payload: GatewayDto) {
    await this.gatewayService.sendMessage(
      client.data.user.sub,
      client.data.rooms.activeRoom,
      payload,
    );
    this.server.to(payload.room).emit('sendMessage', payload.message);
  }

  @SubscribeMessage('call-user')
  callUser(client: Socket, data: CallDto): void {
    client.to(data.to).emit('call-made', {
      offer: data.offer,
      socket: client.id,
    });
  }

  @SubscribeMessage('make-answer')
  makeAnswer(client: Socket, data: CallDto): void {
    client.to(data.to).emit('answer-made', {
      socket: client.id,
      answer: data.answer,
    });
  }

  @SubscribeMessage('reject-call')
  rejectCall(client: Socket, data: CallDto): void {
    client.to(data.from).emit('call-rejected', {
      socket: client.id,
    });
  }
}
