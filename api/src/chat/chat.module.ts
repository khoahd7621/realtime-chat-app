import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './gateway/chat.gateway';
import { ConnectedUserEntity } from './model/connected-user.entity';
import { RoomEntity } from './model/room.entity';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { RoomService } from './service/room-service/room.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([RoomEntity, ConnectedUserEntity]),
  ],
  providers: [ChatGateway, RoomService, ConnectedUserService],
})
export class ChatModule {}
