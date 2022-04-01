import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KaNotFoundComponent } from '../page-not-found/components/not-found/not-found.component';

import { MainComponent } from './main.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,

    children: [
      {
        path: 'home',
        loadChildren: () => import('./../home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'discount',
        loadChildren: () => import('./../discount/discount-routing.module').then((m) => m.DiscountRoutingModule),
      },
      {
        path: 'products',
        loadChildren: () => import('./../products/products-routing.module').then((m) => m.ProductsRoutingModule),
      },
      {
        path: 'keywords',
        loadChildren: () => import('./../keywords/keywords-routing.module').then((m) => m.KeyWordsRoutingModule),
      },
      {
        path: 'banners',
        loadChildren: () => import('./../banners/banners-routing.module').then((m) => m.BannersRoutingModule),
      },
      {
        path: 'detail-form-discount',
        loadChildren: () => import('../discount/detail-form-discount/detail-form-discount.module').then((m) => m.DetailFormDiscountModule),

      },

      {
        path: 'detail-form-product',
        loadChildren: () => import('../products/detail-form-product/detail-form-product.module').then((m) => m.DetailFormProductModule),

      },
      
      {
        path: 'detail-form-banner',
        loadChildren: () => import('./../banners/detail-form-banner/detail-banner-product.module').then((m) => m.DetailFormBannerModule),

      },

      {
        path: 'nps-poll',
        loadChildren: () => import('./../nps-poll/nps-poll-routing.module').then((m) => m.NpsPollRoutingModule),
      },

            
      {
        path: 'nps-poll',
        loadChildren: () => import('./../nps-poll/detail-form-nps-poll/detail-form-nps-poll.module').then((m) => m.DetailFormNpsPollModule),

      },
      {
        path: '**',
        component: KaNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
