import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService, MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from '../app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { reducers } from './core/state/app.state';
import { metaReducers } from './core/state/app.state';
import { DiscountComponent } from './pages/discount/discount.component';
import { DiscountRoutingModule } from './pages/discount/discount-routing.module';
import { LoginModule } from './pages/login/login.module';
import { ProductsComponent } from './pages/products/products.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { KeyWordsComponent } from './pages/keywords/keywords.component';
import { BannersComponent } from './pages/banners/banners.component';
import { NpsPollComponent } from './pages/nps-poll/nps-poll.component';

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

@NgModule({
  declarations: [AppComponent, DiscountComponent, ProductsComponent, KeyWordsComponent, BannersComponent, NpsPollComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    LoginModule,
    CoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler },
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ name: 'Andina App Devtools', maxAge: 25, logOnly: environment.production }),
    NgxSpinnerModule,
    DiscountRoutingModule,
    MatTableExporterModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})

export class AppModule { }
