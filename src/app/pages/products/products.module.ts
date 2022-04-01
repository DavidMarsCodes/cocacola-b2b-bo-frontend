import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MissingTranslationHandler, MissingTranslationHandlerParams, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from '../../shared/shared.module';
import { KaCarouselComponent } from '../home/components/ka-carousel/ka-carousel.component';
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ModalsService } from '../../core/services/modals.service';
import { MatTableExporterModule } from 'mat-table-exporter';

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
  declarations: [ProductsComponent, KaCarouselComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    MatTableExporterModule,
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
export class ProductsModule { }
