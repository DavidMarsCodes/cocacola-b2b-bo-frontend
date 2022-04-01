import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KaSelectCountryComponent } from './components/ka-select-country/ka-select-country.component';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as fromMaterial from '../../assets/scss/material-components';
import { KaImageMenuComponent } from './components/ka-image-menu/ka-image-menu.component';
import { KaVerticalImageMenuComponent } from './components/ka-vertical-image-menu/ka-vertical-image-menu.component';
import { KaNavbarComponent } from './components/ka-navbar/ka-navbar.component';
import { KaNavbarMenuMobileComponent } from './components/ka-navbar-menu-mobile/ka-navbar-menu-mobile.component';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { KaSplittedInputComponent } from './components/ka-splitted-input/ka-splitted-input.component';
import { KaButtonMenuComponent } from './components/ka-button-menu/ka-button-menu.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { SessionExpiredModalComponent } from './modals/session-expired-modal/session-expired-modal.component';
import { KaCurrencyPipe } from './pipes/ka-currency.pipe';
import { KaDatePipe } from './pipes/ka-date.pipe';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { LoadingModalComponent } from './modals/loading-modal/loading-modal.component';
import { UploadFilesModalComponent } from './modals/upload-files-modal/upload-files-modal.component';
import { KaLoginNavbarComponent } from './components/ka-login-navbar/ka-login-navbar.component';
import { EditFileModalComponent } from './modals/edit-file-modal/edit-file-modal.component';
import { DeleteMultipleModalComponent } from './modals/delete-multiple-modal/delete-multiple-modal.component';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/locale/', '.json');
}

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams): any {
    if (params.interpolateParams) {
      return params.interpolateParams['Default'] || params.key;
    }
    return params.key;
  }
}

const sharedModules: any[] = [
  CommonModule,
  NgbModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  CarouselModule,
  FontAwesomeModule,
  ...fromMaterial.materialComponents,
  InfiniteScrollModule,
  UiSwitchModule,
];

const sharedComponents: any[] = [
  KaSelectCountryComponent,
  KaImageMenuComponent,
  KaVerticalImageMenuComponent,
  KaNavbarComponent,
  KaNavbarMenuMobileComponent,
  KaLoginNavbarComponent,
  KaSplittedInputComponent,
  KaButtonMenuComponent,
  SessionExpiredModalComponent,
  ConfirmModalComponent,
  UploadFilesModalComponent,
];

const sharedPipes: any[] = [KaCurrencyPipe, KaDatePipe];

@NgModule({
  declarations: [sharedComponents, sharedPipes, LoadingModalComponent, EditFileModalComponent, DeleteMultipleModalComponent],
  imports: [
    sharedModules,
    TranslateModule.forChild({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      extend: true,
    }),
  ],
  exports: [sharedModules, sharedComponents, sharedPipes, TranslateModule],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class SharedModule {
  constructor(library: FaIconLibrary) {
  }
}
