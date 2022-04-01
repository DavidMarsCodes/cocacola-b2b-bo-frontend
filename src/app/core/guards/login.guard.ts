import { Injectable, OnDestroy } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { UserInfo } from '../models/user-info.model';
import { Store } from '@ngrx/store';
import { isAuthenticated } from '../state/reducers/user.reducer';
import { UserLocal } from '../models/user-local.model';
import { Subscription } from 'rxjs';
@Injectable()
export class LoginGuard implements CanActivate, OnDestroy {
  isAuthenticated: boolean;

  private subscriptions = new Subscription();

  constructor(public router: Router, private store: Store<{ user: UserInfo; userLocal: UserLocal }>) {
    this.subscriptions.add(this.store.select(isAuthenticated).subscribe((isAuth) => (this.isAuthenticated = !!isAuth)));
  }

  canActivate(): boolean {
    const isAllowed = this.isAuthenticated;
    if (isAllowed) {
      this.router.navigate(['/main/home']);
    }
    return !isAllowed;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
