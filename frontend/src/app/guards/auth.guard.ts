import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const jwtService = inject(JwtHelperService);

  if (jwtService.isTokenExpired()) {
    router.navigate(['']);
    return false;
  }

  return true;
};
