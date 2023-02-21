import { Controller } from '@nestjs/common';
import { RoomService } from './room.service';
import { Get } from '@nestjs/common';
import {
  Body,
  Query,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import { getAnswer } from '../answer/answer';

@Controller('room')
export class RoomController {
  constructor(private readonly roomServer: RoomService) {}

  @Get('')
  allRoom(@Query('id') id: string) {
    return this.roomServer.getAllRoom(id);
  }

  @Post('')
  createRoom(@Body('name') name: string, @Body('size') size: number) {
    return this.roomServer.createRoom(name, size);
  }
  @Post('join')
  joinRoom(
    @Body('name') name: string,
    @Body('photo') photo: string,
    @Body('id') id: string,
    @Body('roomName') roomName: string,
  ) {
    return this.roomServer.joinRomm(id, name, photo, roomName);
  }
  @Get('init')
  roomInit(@Query('roomName') roomName: string) {
    return this.roomServer.roomInit(roomName);
  }
  @Get('leave')
  leaveRoom(@Query('id') id: string, @Query('roomName') roomName: string) {
    return this.roomServer.leaveRoom(id, roomName);
  }
  @Get('answer')
  getAnswer() {
    return getAnswer();
  }
  @Post('answer')
  setAnswer(
    @Body('roomName') roomName: string,
    @Body('answer') answer: string,
  ) {
    return this.roomServer.roomStart(roomName, answer);
  }
  @Get('hint')
  hint(@Query('roomName') roomName) {
    return this.roomServer.addhint(roomName);
  }
  @Post('abandon')
  abandon(@Body('roomName') roomName) {
    return this.roomServer.abanden(roomName);
  }
  @Post('submit')
  submit(@Body() body) {
    return this.roomServer.submitAnswer(body.roomName, body.id);
  }
  @Get('match')
  match() {
    return this.roomServer.match();
  }
}
