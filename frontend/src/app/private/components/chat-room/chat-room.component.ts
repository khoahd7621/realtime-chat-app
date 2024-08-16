import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';

import { MessagePaginateI } from '../../../model/message.interface';
import { RoomI } from '../../../model/room.interface';
import { ChatService } from '../../services/chat-service/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.scss',
})
export class ChatRoomComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chatRoom: RoomI;

  messages$: Observable<MessagePaginateI> = this.chatService.getMessage().pipe(
    map((messagePaginate: MessagePaginateI) => {
      const items = messagePaginate.items.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      messagePaginate.items = items;
      return messagePaginate;
    })
  );

  chatMessage: FormControl = new FormControl(null, [Validators.required]);

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.chatService.leaveRoom(changes['chatRoom'].previousValue);
    if (this.chatRoom) {
      this.chatService.joinRoom(this.chatRoom);
    }
  }

  ngOnDestroy(): void {
    this.chatService.leaveRoom(this.chatRoom);
  }

  sendMessage() {
    this.chatService.sendMessage({
      text: this.chatMessage.value,
      room: this.chatRoom,
    });
    this.chatMessage.reset();
  }
}
