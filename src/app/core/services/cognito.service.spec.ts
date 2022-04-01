import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { CognitoService } from './cognito.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Storage } from 'aws-amplify';
import { Inject } from '@angular/core';

const initialState = {
  userLocal: {
    geoCountryCode: 'CL',
  },
  user: {
    countryId: 'CL',
    jwt: 'jdskfsdjklafncjkljeñoMSDKÑSLNCVJKDSNV',
    email: 'asd@asd.com'
  },
};


const validResponse = {
  data: [
    `limonada, jugo
ades, leche, soja, soya, hades
gloe, aloe, vera`
  ]
} as any;


const fileResponse = {
  Body: validResponse.data
} as any;


describe('CognitoService', () => {
  let service: CognitoService;
  let httpTestingController: HttpTestingController;
  let spyStorageCall: jasmine.SpyObj<Storage>;


  beforeEach(() => {
    let store: MockStore;
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule],
      providers: [
        provideMockStore({ initialState }),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    store = TestBed.inject(MockStore);
    service = TestBed.inject(CognitoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get keywords', (done: DoneFn) => {
    Storage.get = jasmine.createSpy().and.callFake(() => Promise.resolve(fileResponse));
    service.readFileBlobInBucket('anyfile').then((response) => {
      expect(response).toEqual(validResponse.data[0]);
      done();
    });
    httpTestingController.verify();
  });

});
