// auth-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  // 1. Create a BehaviorSubject to hold the status. Default both to false.
  private authStateSource = new BehaviorSubject<{ isLoggedIn: boolean, isAdmin: boolean }>({
    isLoggedIn: false,
    isAdmin: false
  });

  // 2. Expose it as an observable for other components to listen to
  currentAuthState = this.authStateSource.asObservable();

  constructor() { }

  // 3. Method to push new updates to anyone listening
  updateStatus(isLoggedIn: boolean, isAdmin: boolean) {
    this.authStateSource.next({ isLoggedIn, isAdmin });
  }
}
