import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { TranslateService } from '@ngx-translate/core';
import { UserLocal } from 'src/app/core/models/user-local.model';

@Component({
  selector: 'app-ka-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class KaNotFoundComponent implements OnInit, OnDestroy {
  readonly LANG_ROOT = 'ERRORS.404.';
  private subscriptions = new Subscription();
  countryCode: CountryCodes;
  isLoggedIn: boolean;

  constructor(private store: Store<{ user: UserInfo; userLocal: UserLocal }>, private translateService: TranslateService) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.isLoggedIn = !!user.jwt)));
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
  }

  ngOnInit(): void {
    this.translateService.use(this.countryCode);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
