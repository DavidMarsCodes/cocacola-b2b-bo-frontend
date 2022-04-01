import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import Amplify from 'aws-amplify';
import { Subscription } from 'rxjs';
import { Constants } from './core/constants/constants';
import { CountryCodes } from './core/enums/country-codes.enum';
import { UserInfo } from './core/models/user-info.model';
import { UserLocal } from './core/models/user-local.model';
import { GeoLocationService } from './core/services/geo-location.service';
import * as UserLocalActions from './core/state/actions/user-local.actions';
import amplifyConfig from '../app/config/amplifyConfig';
import { loadCpgId } from './core/state/actions/user-local.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'cocacola-andina';
  translateReady = false;
  private subscriptions = new Subscription();
  user: UserInfo;
  userLocal: UserLocal;
  currentRoute: string;
  readonly CountryCodes = CountryCodes;

  constructor(
    private store: Store<{ user: UserInfo; userLocal: UserLocal }>,
    private geoLocationSrv: GeoLocationService
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal)));
    this.setTranslateLang();
    Amplify.configure(amplifyConfig);
  }

  ngOnInit(): void {
    this.store.dispatch(loadCpgId({ cpgId: '001' }));
    this.setTranslateLang();
  }

  setTranslateLang(): void {
    let userCountry = this.user?.countryId || this.userLocal?.geoCountryCode;

    if (userCountry) {
      this.loadCountry(userCountry);
    } else {
      this.loadCountryCodeByGeo();
    }
  }

  loadCountryCodeByGeo(): void {
    this.geoLocationSrv.getIpAddress().subscribe(
      (res) => {
        this.geoLocationSrv.getLocationByIp(res.ip).subscribe(
          (res) => {
            const selectedCountry = Constants.countries.find((country) => country.key === res.data.country);
            this.loadCountry(selectedCountry ? res.data.country : CountryCodes.CHILE);
          },
          (error) => {
            this.loadCountry(CountryCodes.CHILE);
          }
        );
      },
      (error) => {
        this.loadCountry(CountryCodes.CHILE);
      }
    );
  }

  private loadCountry(countryCode): void {
    this.store.dispatch(UserLocalActions.loadGeoCountryCode({ countryCode: countryCode }));
    const selectedCountry = Constants.countries.find((country) => country.key === countryCode);
    this.store.dispatch(UserLocalActions.loadOrganizationId({ organizationId: selectedCountry.organizationId }));
    this.translateReady = true;
  }
}
