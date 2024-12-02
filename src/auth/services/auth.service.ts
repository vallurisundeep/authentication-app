import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ILoginRequest } from '../models/login-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken'; // Key for storing access token in localStorage
  private loginURL = `${environment.apiBaseUrl}/users/login`;
  private refreshURL = `${environment.apiBaseUrl}/users/refresh`;
  private currentAccessToken: string | null = this.getTokenFromStorage(); // Initialize from storage

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  /**
   * Log in the user
   * @param loginData LoginRequest object containing email and password
   * @returns Observable<{ accessToken: string }>
   */
  login(loginData: ILoginRequest): Observable<{ accessToken: string }> {
    return this.httpClient.post<{ accessToken: string }>(
      this.loginURL,
      loginData,
      { withCredentials: true } // Ensure cookies are sent with the request
    ).pipe(
      tap((response) => {
        this.storeToken(response.accessToken); // Store token in localStorage
        this.isAuthenticatedSubject.next(true); // Mark user as authenticated
      }),
      catchError((error) => {
        if (error.status === 401) {
          console.error('Invalid email or password');
        }
        return throwError(() => error); // Propagate the error back to the component
      })
    );
  }

  /**
   * Refresh the access token
   * @returns Observable<{ accessToken: string }>
   */
  refreshAccessToken(): Observable<{ accessToken: string }> {
    return this.httpClient.post<{ accessToken: string }>(
      this.refreshURL,
      {},
      { withCredentials: true } // Send cookies with the request
    ).pipe(
      tap((response) => {
        this.storeToken(response.accessToken); // Update the stored token
      }),
      catchError((error) => {
        console.error('Failed to refresh token:', error);
        this.logout(); // Log out the user if refresh fails
        return throwError(() => error);
      })
    );
  }

  /**
   * Log out the user
   */
  logout(): void {
    this.clearToken(); // Clear token from storage
    this.isAuthenticatedSubject.next(false); // Notify subscribers about logout
    window.location.href = '/login'; // Redirect to login page
  }

  /**
   * Get the current access token
   * Validates token expiry before returning it
   * @returns string | null
   */
  getAccessToken(): string | null {
    if (this.currentAccessToken && !this.isTokenExpired(this.currentAccessToken)) {
      return this.currentAccessToken;
    }
    return null; // Return null if the token is expired
  }

  /**
   * Get the current user's role
   * @returns string | null
   */
  getUserRole(): string | null {
    const token = this.getAccessToken();
    if (token) {
      try {
        const payload = this.decodeToken(token);
        return payload.role; // Extract role from token payload
      } catch (err) {
        console.error('Failed to decode role from token:', err);
        return null;
      }
    }
    return null;
  }

  /**
   * Check if a valid token exists
   * @returns boolean
   */
  private hasToken(): boolean {
    const token = this.getTokenFromStorage();
    return !!token && !this.isTokenExpired(token);
  }

  /**
   * Store the access token in localStorage
   * @param token string
   */
  storeToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    this.currentAccessToken = token;
  }

  /**
   * Retrieve the access token from localStorage
   * @returns string | null
   */
  private getTokenFromStorage(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Clear the token from localStorage
   */
  private clearToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    this.currentAccessToken = null;
  }

  /**
   * Check if a token is expired
   * @param token string
   * @returns boolean
   */
  private isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    return payload.exp * 1000 < Date.now(); // `exp` is in seconds, convert to milliseconds
  }

  /**
   * Decode a JWT token
   * @param token string
   * @returns any
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1]; // JWT format: header.payload.signature
      return JSON.parse(atob(payload));   // Decode base64 payload
    } catch (e) {
      console.error('Failed to decode token:', e);
      return null;
    }
  }

  register(userData: any) {
    const registerURL = `${environment.apiBaseUrl}/users/register`;
    return this.httpClient.post(registerURL, userData);
  }

}
