import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, tap, throwError } from 'rxjs';

import { LoginResponseI } from '../../../model/login-response.interface';
import { UserI } from '../../../model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private jwtService: JwtHelperService
  ) {}

  login(user: UserI): Observable<LoginResponseI> {
    return this.http.post<LoginResponseI>('api/users/login', user).pipe(
      tap((res: LoginResponseI) =>
        localStorage.setItem('nestjs_chat_app', res.access_token)
      ),
      tap(() =>
        this.snackBar.open('Login successful', 'Close', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        })
      ),
      catchError((e) => {
        this.snackBar.open(
          `Login failed, due to: ${e.error.message}`,
          'Close',
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
        const err = new Error(e);
        return throwError(() => err);
      })
    );
  }

  getLoggedInUser(): UserI {
    const decodedToken = this.jwtService.decodeToken();
    return decodedToken.user;
  }
}
