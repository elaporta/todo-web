// dependencies
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';

// services
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAuthenticated()) return true;

  router.navigate(['/auth']);
  return false;
};

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(!authService.isAuthenticated()) return true;

  router.navigate(['/tasks']);
  return false;
};