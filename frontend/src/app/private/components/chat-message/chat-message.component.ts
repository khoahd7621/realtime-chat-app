import { Component, Input } from '@angular/core';

import { MessageI } from '../../../model/message.interface';
import { AuthService } from '../../../public/services/auth-service/auth.service';
import { UserI } from '../../../model/user.interface';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  @Input() message: MessageI;
  user: UserI = this.authService.getLoggedInUser();

  constructor(private authService: AuthService) {}
}
