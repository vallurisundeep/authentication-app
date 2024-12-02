import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.getAccessToken();

  // Attach the Authorization header if an access token exists
  if (accessToken) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  return next(req).pipe(
    catchError((error) => {
      // Handle only 401 responses related to token expiration
      if (error.status === 401 && accessToken) {
        return authService.refreshAccessToken().pipe(
          switchMap((newResponse) => {
            const newAccessToken = newResponse.accessToken;

            // Update the AuthService with the new token
            authService.storeToken(newAccessToken);

            // Retry the failed request with the new token
            const clonedReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newAccessToken}` },
            });
            return next(clonedReq);
          }),
          catchError((refreshError) => {
            // If refresh token fails, log out the user
            console.error('Refresh token failed:', refreshError);
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      // For other errors, propagate the error to the caller
      return throwError(() => error);
    })
  );
};
