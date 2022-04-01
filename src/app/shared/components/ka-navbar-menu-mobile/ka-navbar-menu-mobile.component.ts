import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { logout } from 'src/app/core/state/actions/user.actions';

@Component({
  selector: 'app-ka-navbar-menu-mobile',
  templateUrl: './ka-navbar-menu-mobile.component.html',
  styleUrls: ['./ka-navbar-menu-mobile.component.scss'],
})
export class KaNavbarMenuMobileComponent implements OnInit {
  isNewOrder = false;

  constructor(private router: Router, private store: Store<{ user: UserInfo }>) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects.split('/')[2];
        this.isNewOrder = currentRoute === 'nuevo-pedido';
      }
    });
  }

  ngOnInit(): void {}

  signOut(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/']);
  }
}
