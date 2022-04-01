import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CognitoErrorResp } from 'src/app/core/models/backend/cognito-error-resp';
import { UserInfo } from 'src/app/core/models/user-info.model';
import { CognitoService } from 'src/app/core/services/cognito.service';
import { UserLocal } from 'src/app/core/models/user-local.model';
import { Subscription } from 'rxjs';
import { CountryCodes } from 'src/app/core/enums/country-codes.enum';
import { loadJwt, loadUser } from 'src/app/core/state/actions/user.actions';
import { Hub } from '@aws-amplify/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  countryCode: CountryCodes;
  serviceError = false;
  user: UserInfo;
  readonly ROOT_LANG = 'LOGIN.SIGN_IN.';

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private cognitoService: CognitoService,
    private store: Store<{ user: UserInfo; userLocal: UserLocal }>,
  ) {
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.countryCode = userLocal.geoCountryCode)));
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));

  }

  ngOnInit(): void {
    this.subscribeToAuthChanges();
    this.spinner.show();
  }

  private async subscribeToAuthChanges(): Promise<void> {
    Hub.listen('auth', async ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          this.spinner.hide();
          this.cognitoService.checkUser().subscribe(
            (user) => {
              const jwt = user.signInUserSession.idToken.jwtToken;
              this.store.dispatch(loadUser({ user: { email: user.username } }));
              this.store.dispatch(loadJwt({ jwt }));
              this.router.navigate(['/main/home']);
            },
            (error) => this.handleError(error)
          );
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.warn(data);
          break;
        default:
          break;
      }
    });
  }

  private handleError(error: CognitoErrorResp | any): void {
    this.translateService.get('ERRORS.' + error.code).subscribe((errorText: string) => {
      this.serviceError = true;
    });
  }

  public redirectToInit(): void {
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
