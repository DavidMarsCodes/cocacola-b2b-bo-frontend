import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from '../../shared/shared.module';
import { NpsPollRoutingModule } from './nps-poll-routing.module';
import { NpsPollComponent } from './nps-poll.component';
import { ModalsService } from '../../core/services/modals.service';

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
  declarations: [NpsPollComponent],
  imports: [
    CommonModule,
    NpsPollRoutingModule,
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
  providers: [ModalsService],
})

export class NpsPollModule { }
