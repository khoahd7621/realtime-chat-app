import { Injectable } from '@angular/core';
import { CustomSocket } from '../../sockets/custom-socket';
import { RoomI, RoomPaginateI } from '../../../model/room.interface';
import { UserI } from '../../../model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private socket: CustomSocket) {}

  sendMessage() {}

  getMessage() {
    return this.socket.fromEvent('message');
  }

  getMyRooms() {
    return this.socket.fromEvent<RoomPaginateI>('rooms');
  }

  createRoom() {
    const user2: UserI = {
      email: 'test2@gmail.com',
      username: 'test2',
      password: 'password',
    };

    const room: RoomI = {
      name: 'Test Room',
      users: [user2],
    };

    this.socket.emit('createRoom', room);
  }
}
