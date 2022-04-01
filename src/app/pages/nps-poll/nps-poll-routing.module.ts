import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NpsPollComponent } from './nps-poll.component';

const routes: Routes = [{ path: '', component: NpsPollComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NpsPollRoutingModule { }
