import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BannersService } from '../../core/services/banners.service';
import { BannersComponent } from './banners.component';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { of } from 'rxjs';
import { BERespModel } from 'src/app/core/models/backend/BE-response.model';

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
  httpStatus: 200,
  ok: true,
  code: 0,
  data: [

    {

      active: true,
      date: "2022-01-21T07:16:57.000Z",
      device: "Desktop",
      idBanner: 1,
      lastUpdate: "2022-01-22T07:16:57.000Z",
      title: "Refréscate este verano con Coca-Cola"
    }
  ]
} as BERespModel;


describe('BannersComponent', () => {
  let component: BannersComponent;
  let fixture: ComponentFixture<BannersComponent>;
  let spyCognitoService: jasmine.SpyObj<BannersService>;


  beforeEach(async () => {
    spyCognitoService = jasmine.createSpyObj<BannersService>('BannersService', ['getAllBanners']);
    spyCognitoService.getAllBanners.and.returnValue(of(validResponse));

    await TestBed.configureTestingModule({
      declarations: [BannersComponent],
      imports: [MatMenuModule, ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: BannersService, useValue: spyCognitoService }

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all banners ', () => {
    spyCognitoService.getAllBanners().subscribe(
      async (resp) => {
        expect(resp.data).toBe(validResponse.data);

      });
  });




});
