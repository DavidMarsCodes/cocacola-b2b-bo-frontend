import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailFormBannerComponent } from './detail-form-banner.component';

const routes: Routes = [{ path: '', component: DetailFormBannerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailFormBannerRoutingModule {}
