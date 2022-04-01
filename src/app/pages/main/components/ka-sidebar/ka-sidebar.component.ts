import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { logout } from 'src/app/core/state/actions/user.actions';
import { ParserUtils } from 'src/app/core/utils/parser-utils';
import { CognitoService } from '../../../../core/services/cognito.service';

@Component({
  selector: 'app-ka-sidebar',
  templateUrl: './ka-sidebar.component.html',
  styleUrls: ['./ka-sidebar.component.scss'],
})
export class KaSidebarComponent implements OnInit, OnDestroy {
  @Input() isMobile = false;
  sidebarOptions: any[] = [];
  isNewOrderSelected = false;

  private subscriptions = new Subscription();

  readonly ParserUtils = ParserUtils;

  constructor(private router: Router, private store: Store<{ user: UserInfo; }>, private cognitoService: CognitoService) {
  }

  ngOnInit(): void {
    this.sidebarOptions = this.generateOptions();
    this.updateNavOptions(this.router.url.split('/')[2]);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects.split('/')[2];
        this.updateNavOptions(currentRoute);
      }
    });
  }

  updateNavOptions(currentRoute): void {
    this.sidebarOptions.forEach((opt) => {
      opt.active = opt.routerLink.split('/')[0] === currentRoute;
    });
  }

  generateOptions(): any[] {
    return [
      {
        active: false,
        routerLink: 'home',
        icon: 'device-laptop',
        langKey: 'START',
        disabled: false,
      },
      {
        active: false,
        routerLink: 'discount',
        icon: 'discount',
        langKey: 'MY_DISCRETIONARY_DISCOUNTS',
        disabled: false,
      },
      {
        active: false,
        routerLink: 'keywords',
        icon: 'keywords',
        langKey: 'KEY_WORDS',
        disabled: false,
      },
      {
        active: false,
        routerLink: 'products',
        icon: 'bottle',
        langKey: 'MY_PRODUCTS',
        disabled: false,
      },
      {
        active: false,
        routerLink: 'banners',
        icon: 'bottle',
        langKey: 'BANNERS',
        disabled: false,
      },
      {
        active: false,
        routerLink: 'nps-poll',
        icon: 'bottle',
        langKey: 'NPS',
        disabled: false,
      },
    ];
  }

  optionSelected(optSelected): void {
    if (optSelected.disabled) return;
    this.sidebarOptions.forEach((opt) => {
      opt.active = opt.langKey === optSelected.langKey;
    });
    this.isNewOrderSelected = optSelected.langKey === 'NEW_ORDER';
    this.router.navigate(['/main/' + optSelected.routerLink]);
  }

  signOut(): void {
    this.store.dispatch(logout());
    this.cognitoService.signOut();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
