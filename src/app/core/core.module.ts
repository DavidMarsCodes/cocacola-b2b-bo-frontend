import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { EncrDecrService } from './services/encr-decr.service';
import { ModalsService } from './services/modals.service';
import { GeoLocationService } from './services/geo-location.service';
import { AwsInterceptor } from './interceptors/aws.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';
import { DiscretionaryDiscountService } from './services/discretionary-discount.service';
import { CognitoService } from './services/cognito.service';

const coreServices = [
  ApiService,
  GeoLocationService,
  EncrDecrService,
  ModalsService,
  DiscretionaryDiscountService,
  CognitoService
];

const guards = [AuthGuard, LoginGuard];

@NgModule({
  imports: [CommonModule, ToastrModule.forRoot()],
  providers: [...coreServices, ...guards, { provide: HTTP_INTERCEPTORS, useClass: AwsInterceptor, multi: true }],
  exports: [],
  declarations: [],
})
export class CoreModule { }
