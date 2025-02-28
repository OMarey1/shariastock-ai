import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUser: User = {
    id: '1',
    email: 'user@example.com',
    name: 'Demo User',
    createdAt: new Date().toISOString()
  };

  private authState = new BehaviorSubject<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: false
  });

  constructor() {
    // Check if user is already logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.authState.next({
        user,
        isAuthenticated: true,
        loading: false
      });
    }
  }

  get authState$(): Observable<AuthState> {
    return this.authState.asObservable();
  }

  get isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }

  get currentUser(): User | null {
    return this.authState.value.user;
  }

  login(email: string, password: string): Observable<User> {
    this.authState.next({
      ...this.authState.value,
      loading: true
    });

    // Simulate API call
    return of(this.mockUser).pipe(
      delay(800),
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.authState.next({
          user,
          isAuthenticated: true,
          loading: false
        });
      })
    );
  }

  register(email: string, password: string, name: string): Observable<User> {
    this.authState.next({
      ...this.authState.value,
      loading: true
    });

    // Create a new user based on input
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name,
      createdAt: new Date().toISOString()
    };

    // Simulate API call
    return of(newUser).pipe(
      delay(800),
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.authState.next({
          user,
          isAuthenticated: true,
          loading: false
        });
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.authState.next({
      user: null,
      isAuthenticated: false,
      loading: false
    });
  }
}