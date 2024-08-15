import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConnectedUserEntity } from 'src/chat/model/connected-user.entity';
import { ConnectedUserI } from 'src/chat/model/connected-user.interface';
import { UserI } from 'src/user/model/user.interface';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private readonly connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(connectedUser: ConnectedUserI): Promise<ConnectedUserI> {
    return this.connectedUserRepository.save(connectedUser);
  }

  async findByUser(user: UserI): Promise<ConnectedUserI[]> {
    return this.connectedUserRepository.find({
      where: {
        user,
      },
    });
  }

  async deleteBySocketId(socketId: string) {
    return this.connectedUserRepository.delete({
      socketId,
    });
  }
}
