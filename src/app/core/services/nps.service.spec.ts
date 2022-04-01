import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BERespModel } from '../models/backend/BE-response.model';
import { Product } from '../models/product.model';
import { NpsService } from './nps.service';



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
      discountId: 424,
      validityTo: '2099-12-31T00:00:00.000Z',
      discountType: 'P',
      name: '0000007625',
      detail: '',
      limitPrice: '0.000',
      updatedTime: null,
      deleted: false,
      discounts: [{ percentage: '16.900', escaleQtyMin: 0, escaleQtyMax: 0 }]
    },
    {
      discountId: 421,
      validityTo: '2099-12-31T00:00:00.000Z',
      discountType: 'P',
      name: '0000006407',
      detail: '',
      limitPrice: '0.000',
      updatedTime: null,
      deleted: false,
      discounts: [{ percentage: '30.200', escaleQtyMin: 0, escaleQtyMax: 0 }]
    }
  ]
} as BERespModel;

const validResponse2 = {

  httpStatus: 201,

  ok: true,

  code: 0,

  data: [

    1

  ],

} as BERespModel;

const errorProducts = {
  httpStatus: 404,
  ok: false,
  code: 30,
  errorType: 'Products error',
  message: 'Products not found',
  data: '',
};

const validResponseCategories =
{
  httpStatus: 201,
  ok: true,
  code: 0,
  data: {
    categories: [
      { productGroupId: 1, name: 'Sin macrocategoria' },
      { productGroupId: 2, name: 'Otras Bebidas' },
      { productGroupId: 3, name: 'Cerveza' }
    ],

    macrocategories: [
      { productGroupId: 4, name: 'Bebidas' },
      { productGroupId: 5, name: 'Otras Bebidas' }
    ]
  },
};

const product = {
  productId: 0,
  brand: '',
  category: 19,
  macrocategory: 1,
  erpProductId: '0',
  image: null,
  isFilter: 0,
  locked: false,
  name: '',
  package: '',
  size: ''
} as Product;

describe('NpsService', () => {
  let service: NpsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    let store: MockStore;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule],
      providers: [provideMockStore({ initialState })],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);

    service = TestBed.inject(NpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should all polls', (done: DoneFn) => {

    service.getAllNpsPoll().subscribe((response) => {
      expect(response).toEqual(validResponse);

      done();
    });

    const testReq = httpTestingController.expectOne(

      '/test/v1/backoffice/api/cpg/001/country/CL/nps'
    );
    expect(testReq.request.method).toBe('GET');
    testReq.flush(validResponse);
    httpTestingController.verify();
  });

  it('should return error', (done: DoneFn) => {
    service.getAllNpsPoll().subscribe((response) => {
      expect(response).toEqual(errorProducts);
      done();
    });
    const testReq = httpTestingController.expectOne(
      '/test/v1/backoffice/api/cpg/001/country/CL/nps'
    );
    expect(testReq.request.method).toBe('GET');
    testReq.flush(errorProducts);
    httpTestingController.verify();
  });




});

