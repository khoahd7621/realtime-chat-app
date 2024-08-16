import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';

import { MessageEntity } from 'src/chat/model/message/message.entity';
import { MessageI } from 'src/chat/model/message/message.interface';
import { RoomI } from 'src/chat/model/room/room.interface';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async create(message: MessageI): Promise<MessageI> {
    return this.messageRepository.save(message);
  }

  async findByUser(user: UserI): Promise<MessageI[]> {
    return this.messageRepository.find({
      where: {
        user,
      },
    });
  }

  async findMessagesForRoom(
    room: RoomI,
    options: IPaginationOptions,
  ): Promise<Pagination<MessageI>> {
    const query = this.messageRepository
      .createQueryBuilder('message')
      .leftJoin('message.room', 'room')
      .where('room.id = :roomId', { roomId: room.id })
      .leftJoinAndSelect('message.user', 'user')
      .orderBy('message.created_at', 'DESC');
    return paginate(query, options);
  }
}
