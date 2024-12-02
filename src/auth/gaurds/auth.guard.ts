import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService to check authentication
  const router = inject(Router); // Inject Router to navigate if needed

  if (authService.getAccessToken()) {
    // If access token exists, allow access to the route
    return true;
  } else {
    // If not authenticated, redirect to login page
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }, // Optional: preserve the original URL for redirection after login
    });
    return false;
  }
};
