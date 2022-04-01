import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KeyWordsComponent } from './keywords.component';

const routes: Routes = [{ path: '', component: KeyWordsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeyWordsRoutingModule { }
