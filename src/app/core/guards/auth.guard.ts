import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserLocal } from '../models/user-local.model';
import { UserInfo } from './../models/user-info.model';
import { isAuthenticated } from './../state/reducers/user.reducer';
@Injectable()
export class AuthGuard implements CanActivate, OnDestroy {
  isAuthenticated: boolean;

  private subscriptions = new Subscription();

  constructor(public router: Router, private store: Store<{ user: UserInfo; userLocal: UserLocal }>) {
    this.subscriptions.add(this.store.select(isAuthenticated).subscribe((isAuth) => (this.isAuthenticated = !!isAuth)));
  }

  canActivate(): boolean {
    const isAllowed = this.isAuthenticated;
    if (!isAllowed) {
      this.router.navigate(['']);
    }
    return isAllowed;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
