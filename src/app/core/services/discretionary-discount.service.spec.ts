import { TestBed } from '@angular/core/testing';
import { DiscretionaryDiscountService } from './discretionary-discount.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BERespModel } from '../models/backend/BE-response.model';

const initialState = {
  client: {
    clientId: '001',
    organizationId: '124',
  },
  userLocal: {
    geoCountryCode: 'CL',
  },
  user: {
    countryId: 'CL',
  },
};

const validResponse = {
  httpStatus: 200,
  ok: true,
  code: 0,
  data: [
    {
      discountId: 415,
      validityTo: '2099-12-31T00:00:00.000Z',
      discountType: 'P',
      name: 'Coca-Cola Zero 2.0',
      detail: '',
      limitPrice: '1100.000',
      updatedTime: '2021-10-23T02:06:59.000Z',
      deleted: false,
      amountDiscount: [
        '9.700'
      ]
    },
    {
      discountId: 503,
      validityTo: '2021-12-31T00:00:00.000Z',
      discountType: 'P',
      name: 'Coca-Cola Zero',
      detail: 'Segunda descripción ',
      limitPrice: '2000.000',
      updatedTime: '2021-10-22T16:05:29.000Z',
      deleted: false,
      amountDiscount: [
        '22.200'
      ]
    }
  ]
} as BERespModel;

const errorDiscretionaryDiscount = {
  httpStatus: 404,
  ok: false,
  code: 30,
  errorType: 'discretionary discounts error',
  message: 'discretionary discounts not found',
  data: '',
};

describe('DiscretionaryDiscountService', () => {
  let service: DiscretionaryDiscountService;
  let httpTestingController: HttpTestingController;


  beforeEach(() => {
    let store: MockStore;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule],
      providers: [provideMockStore({ initialState })],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
    service = TestBed.inject(DiscretionaryDiscountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should all discretionary discounts', (done: DoneFn) => {

    service.getAllDiscretionaryDiscount().subscribe((response) => {
      expect(response).toEqual(validResponse);
      done();
    });

    const testReq = httpTestingController.expectOne(
      '/test/v1/backoffice/api/cpg/001/country/CL/discounts/discretionary'
    );
    expect(testReq.request.method).toBe('GET');
    testReq.flush(validResponse);
    httpTestingController.verify();
  });

  it('should return error', (done: DoneFn) => {
    service.getAllDiscretionaryDiscount().subscribe((response) => {
      expect(response).toEqual(errorDiscretionaryDiscount);
      done();
    });
    const testReq = httpTestingController.expectOne(
      '/test/v1/backoffice/api/cpg/001/country/CL/discounts/discretionary'
    );
    expect(testReq.request.method).toBe('GET');
    testReq.flush(errorDiscretionaryDiscount);
    httpTestingController.verify();
  });
});

