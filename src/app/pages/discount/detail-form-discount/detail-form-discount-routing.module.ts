import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailFormDiscountComponent } from './detail-form-discount.component';

const routes: Routes = [{ path: '', component: DetailFormDiscountComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailFormDiscountRoutingModule {}
