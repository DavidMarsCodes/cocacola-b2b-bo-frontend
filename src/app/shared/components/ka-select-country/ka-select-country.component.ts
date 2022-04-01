import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Constants } from 'src/app/core/constants/constants';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { UserLocal } from 'src/app/core/models/user-local.model';
import * as UserLocalActions from 'src/app/core/state/actions/user-local.actions';
@Component({
  selector: 'app-ka-select-country',
  templateUrl: './ka-select-country.component.html',
  styleUrls: ['./ka-select-country.component.scss'],
})
export class KaSelectCountryComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  selectedLang: any = {};
  countryFlags: any[];
  @Input() hasLabel ? = false;
  @Input() readonly ? = false;
  label = '';

  user: UserInfo;
  userLocal: UserLocal;

  constructor(
    private translateService: TranslateService,
    private store: Store<{ user: UserInfo; userLocal: UserLocal }>,
  ) {
    this.countryFlags = Constants.countries;
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
  }

  ngOnInit(): void {
    const lang = this.user.countryId || this.userLocal.geoCountryCode;
    this.selectedLang = this.countryFlags.find((countries) => countries.key === lang);
  }

  selectLanguage(lang): void {
    this.selectedLang = lang;
    this.translateService.use(lang.key);
    this.store.dispatch(UserLocalActions.loadGeoCountryCode({ countryCode: lang.key }));
    this.store.dispatch(UserLocalActions.loadOrganizationId({ organizationId: lang.organizationId }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
