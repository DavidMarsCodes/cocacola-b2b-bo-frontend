import { Injectable, OnDestroy } from '@angular/core';
import { Store, reduceState } from '@ngrx/store';
import { Observable, Subscription, throwError } from 'rxjs';
import { BERespModel } from '../models/backend/BE-response.model';
//import { Client } from '../models/client.model';

import { ApiService } from './api.service';
import { EndpointsCodes } from 'src/app/core/enums/endpoints-codes.enum';
import { DiscretionaryDiscount } from '../models/discretionary-discount.model';

@Injectable({
  providedIn: 'root'
})
export class DiscretionaryDiscountService {

  private subscriptions = new Subscription();
  readonly EndpointsCodes = EndpointsCodes;
  discretionaryDiscountSelect: DiscretionaryDiscount | null;
  constructor(private apiSrv: ApiService) {
    
  }

  getAllDiscretionaryDiscount(): Observable<BERespModel> {
    return new Observable((obs) => {
      this.apiSrv
        .get(`discounts/discretionary`, EndpointsCodes.GET_DISCRETIONARY_DISCOUNT, {})
        .subscribe(
          (res) => obs.next(res),
          (err) => obs.error(err),
          () => obs.complete()
        );
    });
  }

  updateDiscretionaryDiscount(discretionaryDiscount: DiscretionaryDiscount): Observable<BERespModel> {
    const rqBody = {
      discountId: discretionaryDiscount.discountId,
      detail: discretionaryDiscount.detail,
      name: discretionaryDiscount.name,
      limitPrice: discretionaryDiscount.limitPrice
    };
    return new Observable((obs) => {
      this.apiSrv.post(`discounts/discretionary`, EndpointsCodes.UPDATE_DISCRETIONARY_DISCOUNT, rqBody, {}).subscribe(
        (res) => obs.next(res),
        (err) => obs.error(err),
        () => obs.complete()
      );
    });
  }

}
