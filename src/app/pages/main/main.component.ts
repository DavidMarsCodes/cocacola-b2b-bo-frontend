import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { CognitoService } from 'src/app/core/services/cognito.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  subscriptions = new Subscription();
  countryCode: CountryCodes;
  translateReady = true;
  sessionReady = true;
  serviceError = false;

  constructor(
    private translateService: TranslateService,
    private store: Store<{ user: UserInfo }>,
    private cognitoService: CognitoService
  ) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.countryCode = user.countryId as CountryCodes)));
    this.countryCode = 'CL' as CountryCodes;
  }

  ngOnInit(): void {
    this.translateService.use(this.countryCode).subscribe((res) => (this.translateReady = true));
  }

  handleRefreshSession(): void {
    this.cognitoService.refreshUserSession().subscribe();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
