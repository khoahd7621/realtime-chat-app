import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { RoomEntity } from 'src/chat/model/room/room.entity';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
  ) {}

  async createRoom(room: RoomI, creator: UserI): Promise<RoomI> {
    const newRoom = this.addCreatorToRoom(room, creator);
    return this.roomRepository.save(newRoom);
  }

  async getRoom(roomId: number): Promise<RoomI> {
    return this.roomRepository.findOne({
      where: {
        id: roomId,
      },
      relations: ['users'],
    });
  }

  async getRoomsForUser(
    userId: number,
    options: IPaginationOptions,
  ): Promise<Pagination<RoomI>> {
    const query = this.roomRepository
      .createQueryBuilder('room')
      .leftJoin('room.users', 'users')
      .where('users.id = :userId', { userId })
      .leftJoinAndSelect('room.users', 'all_users')
      .orderBy('room.updated_at', 'DESC');

    return paginate(query, options);
  }

  addCreatorToRoom(room: RoomI, creator: UserI): RoomI {
    room.users.push(creator);
    return room;
  }
}
