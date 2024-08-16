import { Component, Input } from '@angular/core';

import { MessageI } from '../../../model/message.interface';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  @Input() message: MessageI;
}
