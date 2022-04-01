import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { LoadingModalComponent } from 'src/app/shared/modals/loading-modal/loading-modal.component';
import { SessionExpiredModalComponent } from 'src/app/shared/modals/session-expired-modal/session-expired-modal.component';
import { environment } from '../../../environments/environment';
import { EndpointsCodes } from '../enums/endpoints-codes.enum';
import { UserInfo } from '../models/user-info.model';
import { logout } from '../state/actions/user.actions';
import { UserLocal } from '../models/user-local.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private serverUrlPublic = environment.BASE_URL_PUBLIC;
  private serverUrlInternal = environment.BASE_URL_INTERNAL;
  user: UserInfo;
  userLocal: UserLocal;

  constructor(
    private httpClient: HttpClient,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private translateService: TranslateService,
    private modalService: NgbModal,
    private router: Router,
    private store: Store<{ user: UserInfo; userLocal: UserLocal }>,
  ) {
    this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal));
    this.store.select('user').subscribe((user) => (this.user = user));
  }

  get(
    endpoint: string,
    endpointCode: EndpointsCodes,
    { isPublic = true, customUrl = '', ngxSpinner = true, customSpinner = false, showError = true }
  ): Observable<any> {
    const finalUrl = this.parseUrl(endpoint, isPublic, customUrl);

    if (ngxSpinner) this.spinner.show();
    let customLoading: NgbModalRef;
    if (customSpinner) {
      this.spinner.hide();
      customLoading = this.modalService.open(LoadingModalComponent, { windowClass: 'ngbmodal-centered', size: 'lg' });
    }

    return new Observable((obs) => {
      this.httpClient.get(finalUrl).subscribe(
        (res) => {
          if (ngxSpinner) this.spinner.hide();
          if (customSpinner) customLoading.close();
          obs.next(res);
        },
        (error: HttpErrorResponse) => {
          if (ngxSpinner) this.spinner.hide();
          if (customSpinner) customLoading.close();
          this.handleApiError(error, endpointCode, showError, ngxSpinner);
          obs.error(error.error);
          obs.complete();
        }
      );
    });
  }

  post(
    endpoint: string,
    endpointCode: EndpointsCodes,
    body: object,
    { isPublic = true, customUrl = '', ngxSpinner = true, showError = true }
  ): Observable<any> {
    const finalUrl = this.parseUrl(endpoint, isPublic, customUrl);

    if (ngxSpinner) this.spinner.show();

    return new Observable((obs) => {
      this.httpClient.post(finalUrl, body).subscribe(
        (res) => {
          if (ngxSpinner) this.spinner.hide();
          obs.next(res);
          obs.complete();
        },
        (error: HttpErrorResponse) => {
          if (ngxSpinner) this.spinner.hide();
          this.handleApiError(error, endpointCode, showError, ngxSpinner);
          obs.error(error.error);
          obs.complete();
        }
      );
    });
  }

  private parseUrl(endpoint, isPublic, customUrl): string {
    let finalUrl = '';
    if (customUrl) {
      finalUrl = customUrl;
    } else {
      finalUrl = isPublic ? this.serverUrlPublic : this.serverUrlInternal;
    }
    const countryId = this.user?.countryId || this.userLocal?.geoCountryCode;
    return finalUrl + countryId + '/' + endpoint;
  }

  private handleApiError(error: HttpErrorResponse, endpointCode: EndpointsCodes, showError: boolean, ngxSpinner: boolean): void {
    if (ngxSpinner) this.spinner.hide();
    if (error.status === 401 || (error as any) === 'The user is not authenticated' || error.status === 409 || error.status === 504) {
      if (!this.modalService.hasOpenModals()) {
        const modalUnauthorized = this.modalService.open(SessionExpiredModalComponent, { windowClass: 'ngbmodal-centered' });
        modalUnauthorized.result.then(
          (confirm) => this.signOut(),
          (rejected) => this.signOut()
        );
      }
      return;
    }
  }

  private toastError(errorCode, endpointCode: EndpointsCodes): void {
    this.translateService.get(['ERRORS.' + errorCode, 'ERRORS.' + endpointCode]).subscribe((errors: any) => {
      const beErrorMsj = errors[Object.keys(errors)[0]];
      const feErrorMsj = errors[Object.keys(errors)[1]];
      if (!beErrorMsj.startsWith('ERRORS.')) {
        this.toastr.error(beErrorMsj);
        return;
      }
      if (!feErrorMsj.startsWith('ERRORS.')) {
        this.toastr.error(feErrorMsj);
        return;
      }
      this.toastr.error(this.translateService.instant('ERRORS.UNKNOWN_ERROR'));
    });
  }

  private signOut(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/']);
  }
}
