import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService to get user role
  const router = inject(Router); // Inject Router for navigation
  const snackBar = inject(MatSnackBar); // Inject Snackbar

  const requiredRole = route.data?.['role']; // Get the required role from route data
  const isAuthenticated = authService.getAccessToken() !== null; // Check if the user is logged in
  const userRole = authService.getUserRole(); // Get the current user's role

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect to the login page
    router.navigate(['/login']);
    return false;
  }

  if (!requiredRole || userRole === requiredRole) {
    // Allow access if no specific role is required or if the user's role matches
    return true;
  }

  // If the user is authenticated but doesn't have the required role, show a message and redirect
  snackBar.open('You do not have access to this page.', 'Close', {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'top',
  });

  router.navigate(['/dashboard']); // Redirect to the dashboard or a fallback page
  return false;
};
