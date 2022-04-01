import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KaNotFoundComponent } from './components/not-found/not-found.component';

const routes: Routes = [{ path: '', component: KaNotFoundComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageNotFoundRoutingModule {}
