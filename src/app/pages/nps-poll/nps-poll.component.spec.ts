import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { BannersService } from '../../core/services/banners.service';
import { NpsPollComponent } from './nps-poll.component';
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
      pollId: 0, active: "Si", secondaryActive: false, applyToAll: false 
    }
  ]
} as BERespModel;


describe('NpsPollComponent', () => {
  let component: NpsPollComponent;
  let fixture: ComponentFixture<NpsPollComponent>;
  let spyCognitoService: jasmine.SpyObj<BannersService>;


  beforeEach(async () => {
    spyCognitoService = jasmine.createSpyObj<BannersService>('BannersService', ['getAllBanners']);
    spyCognitoService.getAllBanners.and.returnValue(of(validResponse));

    await TestBed.configureTestingModule({
      declarations: [NpsPollComponent],
      imports: [MatMenuModule, ToastrModule.forRoot(), RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        provideMockStore({ initialState }),
        { provide: BannersService, useValue: spyCognitoService }

      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NpsPollComponent);
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
