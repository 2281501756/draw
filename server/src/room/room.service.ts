import { Injectable, OnModuleInit } from '@nestjs/common';
import Room, { user } from './Room';
import { Gateway } from 'src/gateway/gateway';

@Injectable()
export class RoomService implements OnModuleInit {
  private roomList: Room[] = [];
  constructor(private readonly gatewayService: Gateway) {}
  onModuleInit() {
    this.gatewayService.server.on('connection', (socket) => {
      socket.on('disconnect', () => {
        for (const room of this.roomList) {
          for (let i = 0; i < room.userList.length; i++) {
            if (room.userList[i].scoketID === socket.id) {
              room.current_person_num--;
              if (room.current_person_num <= 0) {
                this.clearRoom(room.roomName);
                return;
              }
              room.userList.splice(i, 1);
              break;
            }
          }
        }
      });
    });
  }

  getAllRoom(id: string) {
    if (!id)
      return {
        message: 'error',
        data: 'id错误',
      };
    this.gatewayService.server.to(id).emit('allRoom', this.roomList);
    return {
      message: 'success',
    };
  }

  createRoom(name: string, size: number) {
    let res = this.roomList.reduce((prev, currenrv) => {
      if (prev || currenrv.roomName === name) return true;
      return false;
    }, false);
    if (res)
      return {
        message: 'error',
        data: '房间名字已经存在',
      };
    this.roomList.push(
      new Room(
        name,
        size,
        0,
        `/static/roomimg/${Math.floor(Math.random() * 9 + 1)}.png`,
      ),
    );
    this.gatewayService.server.emit('allRoom', this.roomList);
    return {
      message: 'success',
    };
  }
  joinRomm(id: string, name: string, photo: string, roomName: string) {
    let u: user = {
      scoketID: id,
      name,
      photo,
      winNumber: 0,
      boutScore: false,
    };
    let findRoom = this.findRoomByName(roomName);
    if (!findRoom) {
      return {
        message: 'error',
        data: '房间不存在',
      };
    }
    if (findRoom.current_person_num >= findRoom.size) {
      return {
        message: 'error',
        data: '房间已满',
      };
    }
    findRoom.userList.push(u);
    findRoom.current_person_num++;
    this.gatewayService.server.in(id).socketsJoin(roomName);
    this.gatewayService.server.emit('allRoom', this.roomList);

    return {
      message: 'success',
    };
  }
  roomInit(roomName: string) {
    let findRoom = this.findRoomByName(roomName);
    this.gatewayService.server.in(roomName).emit('roomData', findRoom);
  }
  leaveRoom(id: string, roomName: string) {
    let findRoom = this.findRoomByName(roomName);
    for (let i = 0; i < findRoom.userList.length; i++) {
      if (id === findRoom.userList[i].scoketID) findRoom.userList.splice(i, 1);
    }
    findRoom.current_person_num--;
    this.gatewayService.server.sockets.sockets.get(id).leave(roomName);
    if (findRoom.current_person_num <= 0) {
      this.clearRoom(findRoom.roomName);
      return;
    }
    this.gatewayService.server.in(roomName).emit('roomData', findRoom);
  }
  clearRoom(roomName: string) {
    this.gatewayService.server.in(roomName).emit('clearRoom', true);
    for (let i = 0; i < this.roomList.length; i++) {
      if (this.roomList[i].roomName === roomName) {
        this.roomList.splice(i, 1);
        break;
      }
    }
    this.gatewayService.server.emit('allRoom', this.roomList);
  }
  findRoomByName(roomName: string): null | Room {
    let findRoom: Room | null = null;
    for (const i of this.roomList) {
      if (i.roomName === roomName) {
        findRoom = i;
        break;
      }
    }
    return findRoom;
  }
  roomStart(roomName: string, answer: string) {
    const findRoom = this.findRoomByName(roomName);
    findRoom.answer = answer;
    findRoom.start = true;
    this.gatewayService.server.in(roomName).emit('roomData', findRoom);
  }
  addhint(roomName: string) {
    const findRoom = this.findRoomByName(roomName);
    if (findRoom.hint < 2) {
      findRoom.hint++;
    }
    this.gatewayService.server.in(roomName).emit('roomData', findRoom);
  }
  abanden(roomName: string) {
    const findRoom = this.findRoomByName(roomName);
    findRoom.start = false;
    findRoom.activeUser =
      (findRoom.activeUser + 1) % findRoom.current_person_num;
    findRoom.answer = '';
    findRoom.hint = 0;
    findRoom.userList.forEach((i) => {
      i.boutScore = false;
    });
    this.gatewayService.server.in(roomName).emit('roomData', findRoom);
  }
  submitAnswer(roomName: string, id: string) {
    const findRoom = this.findRoomByName(roomName);
    for (const user of findRoom.userList) {
      if (user.scoketID === id) {
        if (user.boutScore === false) {
          user.winNumber += 6;
          findRoom.userList[findRoom.activeUser].winNumber += 3;
          user.boutScore = true;
          this.gatewayService.server.in(roomName).emit('oneManSuccess', {
            id,
            name: user.name,
          });
          this.gatewayService.server.in(roomName).emit('roomData', findRoom);
          return {
            message: 'success',
          };
        } else {
          return {
            message: 'error',
          };
        }
      }
    }
  }
  match() {
    for (const room of this.roomList) {
      if (room.current_person_num < room.size) {
        return {
          message: 'success',
          data: {
            roomName: room.roomName,
          },
        };
      }
    }
    return {
      message: 'error',
    };
  }
}
