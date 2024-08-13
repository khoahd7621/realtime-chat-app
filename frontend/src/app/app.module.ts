import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { JwtModule } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

export function tokenGetter() {
  // During Server-side Rendering (SSR): If your Angular application uses Angular
  // Universal or any form of server-side rendering, localStorage will not be available
  // because localStorage is a browser-specific feature. Code executed on the server does
  // not have access to browser APIs
  const isLocalStorageAvailable = typeof localStorage !== 'undefined';
  if (isLocalStorageAvailable) {
    const jwtToken = localStorage.getItem('nestjs_chat_app');
    return jwtToken ?? '';
  }
  return '';
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:3000'],
      },
    }),
  ],
  providers: [provideClientHydration(), provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
