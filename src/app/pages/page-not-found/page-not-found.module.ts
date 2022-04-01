import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { KaNotFoundComponent } from './components/not-found/not-found.component';
import { PageNotFoundRoutingModule } from './page-not-found-routing.module';

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
  declarations: [KaNotFoundComponent],
  imports: [
    CommonModule,
    PageNotFoundRoutingModule,
    SharedModule,
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
})
export class PageNotFoundModule {}
