import { Injectable } from '@angular/core';
import { Observable, Subscription, throwError } from 'rxjs';
import { BERespModel } from '../models/backend/BE-response.model';
import { ApiService } from './api.service';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private subscriptions = new Subscription();
  readonly EndpointsCodes = EndpointsCodes;
  public productSelect: Product | null;
  constructor(private apiSrv: ApiService) { }


  getAllProducts(): Observable<BERespModel> {
    return new Observable((obs) => {
      this.apiSrv
        .get(`products`, EndpointsCodes.GET_PRODUCT, {})
        .subscribe(
          (res) => obs.next(res),
          (err) => obs.error(err),
          () => obs.complete()
        );
    });
  }

  getCategoriesFilter(): Observable<BERespModel> {
    return new Observable((obs) => {
      this.apiSrv
        .get(`categories`, EndpointsCodes.GET_CATEGORIES, {})
        .subscribe(
          (res) => obs.next(res),
          (err) => obs.error(err),
          () => obs.complete()
        );
    });
  }


  updateProduct(product: Product): Observable<BERespModel> {
    return new Observable((obs) => {
      this.apiSrv.post(`products/${product.productId}`, EndpointsCodes.UPDATE_DISCRETIONARY_DISCOUNT, product, {}).subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }


}
