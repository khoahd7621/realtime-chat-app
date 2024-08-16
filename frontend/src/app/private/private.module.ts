import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ChatMessageComponent } from './components/chat-message/chat-message.component';
import { ChatRoomComponent } from './components/chat-room/chat-room.component';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SelectUsersComponent } from './components/select-users/select-users.component';
import { PrivateRoutingModule } from './private-routing.module';

@NgModule({
  declarations: [
    ChatMessageComponent,
    ChatRoomComponent,
    CreateRoomComponent,
    DashboardComponent,
    SelectUsersComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PrivateRoutingModule,
    MatListModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
})
export class PrivateModule {}
