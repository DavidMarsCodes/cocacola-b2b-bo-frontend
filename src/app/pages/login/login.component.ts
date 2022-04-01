import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { CognitoService } from '../../core/services/cognito.service';
import { UserCognito } from '../../core/models/user-cognito';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginOptions: any[];
  countryCode: CountryCodes;
  private subscriptions = new Subscription();
  readonly ROOT_LANG = 'LOGIN.';
  loggedUser: UserCognito;


  constructor(private router: Router, private translateSrv: TranslateService, private store: Store<{ userLocal: UserLocal }>,
    private cognitoService: CognitoService) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
  }

  ngOnInit(): void {
    this.translateSrv.use(this.countryCode).subscribe(() => {
      this.loginOptions = this.getLoginHomeOptions();
    });
  }

  public signIn(): void {
    this.cognitoService.signInAws();
  }

  getLoginHomeOptions(): any[] {
    const ROOT_LANG = 'LOGIN.HOME.';
    return [
      {
        id: 'ingresar-a-mi-cuenta',
        title: this.translateSrv.instant(ROOT_LANG + 'SIGN_IN.TITLE'),
        subtitle: this.translateSrv.instant(ROOT_LANG + 'SIGN_IN.SUBTITLE'),
        icon: './assets/svg/smile.svg',
        routerLink: 'sign-in',
      },
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
