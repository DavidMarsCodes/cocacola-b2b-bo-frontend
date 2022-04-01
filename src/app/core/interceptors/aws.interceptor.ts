import { Injectable, OnDestroy } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription, throwError, from } from 'rxjs';
import { Store } from '@ngrx/store';
import { UserInfo } from '../models/user-info.model';
import { v4 as uuidv4 } from 'uuid';
import { UserLocal } from '../models/user-local.model';
import { catchError, switchMap, map } from 'rxjs/operators';
import { CognitoService } from '../services/cognito.service';

@Injectable()
export class AwsInterceptor implements HttpInterceptor, OnDestroy {
  private subscriptions = new Subscription();

  user: UserInfo;
  userLocal: UserLocal;

  constructor(private store: Store<{ user: UserInfo; userLocal: UserLocal }>, private cognitoService: CognitoService) {
    this.subscriptions.add(this.store.select('user').subscribe((user) => (this.user = user)));
    this.subscriptions.add(this.store.select('userLocal').subscribe((userLocal) => (this.userLocal = userLocal)));
  }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req.clone({ headers: this.getHeaders() })).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          return this.cognitoService.refreshUserSession().pipe(
            switchMap(() => {
              return next.handle(req.clone({ headers: this.getHeaders() }));
            })
          );
        } else {
          return throwError(err);
        }
      })
    );
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: this.user?.jwt ? 'Bearer ' + this.user?.jwt : '',
      'X-B2B-Transaction-Id': uuidv4(),
      'Content-Type': 'application/json',
      'X-B2B-Organization-Id': this.user?.organizationId || this.userLocal?.organizationId,
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
