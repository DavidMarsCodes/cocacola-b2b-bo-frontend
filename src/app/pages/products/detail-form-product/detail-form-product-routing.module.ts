import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailFormProductComponent } from './detail-form-product.component';

const routes: Routes = [{ path: '', component: DetailFormProductComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailFormProductRoutingModule {}
