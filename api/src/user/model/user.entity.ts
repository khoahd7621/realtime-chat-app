import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ConnectedUserEntity } from 'src/chat/model/connected-user/connected-user.entity';
import { JoinedRoomEntity } from 'src/chat/model/joined-room/joined-room.entity';
import { MessageEntity } from 'src/chat/model/message/message.entity';
import { RoomEntity } from 'src/chat/model/room/room.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @ManyToMany(() => RoomEntity, (room) => room.users)
  rooms: RoomEntity[];

  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  @OneToMany(() => JoinedRoomEntity, (joinedRoom) => joinedRoom.room)
  joinedRooms: JoinedRoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  dataToLowerCase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
