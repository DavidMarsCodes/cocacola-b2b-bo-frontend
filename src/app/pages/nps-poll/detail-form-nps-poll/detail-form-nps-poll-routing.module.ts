import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailFormNpsPollComponent } from './detail-form-nps-poll.component';

const routes: Routes = [{ path: '', component: DetailFormNpsPollComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailFormNpsPollRoutingModule {}
