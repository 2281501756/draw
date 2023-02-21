import { Body, OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: [
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'https://www.acwing.com',
    ],
  },
})
export class Gateway implements OnModuleInit {
  @WebSocketServer()
  public server: Server;
  private userList: string[] = [];

  onModuleInit() {
    this.server.on('connection', (socket) => {
      this.userList.push(socket.id);
      console.log('连接', this.userList);
      socket.emit('init', { id: socket.id });
      this.server.emit('man', this.userList.length);
      socket.on('disconnect', () => {
        if (this.userList.indexOf(socket.id) >= 0) {
          this.userList.splice(this.userList.indexOf(socket.id), 1);
        }
        this.server.emit('man', this.userList.length);
        console.log('断开');
      });
    });
  }

  @SubscribeMessage('get')
  get(@MessageBody() body: any) {
    console.log(body);
    return { event: 'fanhui', data: { name: '返回' } };
  }
  @SubscribeMessage('all')
  all(@MessageBody() body: any) {
    this.server.emit('all', body);
  }
  @SubscribeMessage('draw')
  draw(@MessageBody() body: { roomName: string; id: string; data: any }) {
    this.server.to(body.roomName).emit('draw', body);
  }
  @SubscribeMessage('chat')
  chat(@MessageBody() body) {
    this.server.to(body.roomName).emit('chat', body);
  }
  @SubscribeMessage('man')
  man() {
    return { event: 'man', data: this.userList.length };
  }
}
